import datetime
import json
import os

from dotenv import load_dotenv
from requests import Session

"""
source venv/bin/activate
python -m py.fetch_coinmarketcap
"""

load_dotenv()
apiKey = os.getenv('COINMARKETCAP_API_KEY')
print(apiKey)

url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
parameters = {
    'start': 1,
    'limit': 5000,
    'convert': 'USD'
}
headers = {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': apiKey,
}

session = Session()
session.headers.update(headers)

resp = session.get(url, params=parameters)
if resp.status_code != 200:
    print(resp)
    print(resp.text)
    print('exiting...')
    exit(1)

market = resp.json()
coins = {
    t['symbol']: {
        'name': t['name'],
        'USD': t['quote']['USD']['price'],
    }
    for t in market['data']
}

if len(coins) == 0:
    print('coins is empty, exiting...')
    exit(1)

data = {
    'coins': coins,
    'updated': datetime.datetime.utcnow().isoformat(),
}
with open('docs/price.json', 'w') as f:
    json.dump(
        data,
        f,
        indent=2,
        sort_keys=True,
        separators=(',', ': ')
    )
