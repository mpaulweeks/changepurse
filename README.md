# changepurse

https://mpaulweeks.github.io/changepurse

[MIT License](LICENSE)

static site to view market price of your crypto coins

## updating listed coins

this site caches the coin names to avoid having to fetch all coins from CoinMarketCap, which is 1.3MB as of January 24, 2018

it caches the lookup as a 24KB file named `ticker_names.json`. to update it, perform the following:

```
# to get python setup
virtualenv venv
source venv/bin/activate
pip install -r py/requirements.txt

# to run the script
python -m py.parse_names
```
