import datetime
import json

import requests

"""
source venv/bin/activate
python -m py.fetch_coinmarketcap
"""


URL = 'https://api.coinmarketcap.com/v1/ticker/?limit=0'

resp = requests.get(URL)
market = resp.json()
ticker_names = {
    t['symbol']: t['name']
    for t in market
}
data = {
    'coins': ticker_names,
    'updated': datetime.datetime.utcnow().isoformat(),
}
with open('docs/coinmarketcap.json', 'wb') as f:
    json.dump(
        ticker_names,
        f,
        indent=0,
        sort_keys=True,
        separators=(',', ':')
    )
