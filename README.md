# changepurse

https://mpaulweeks.github.io/changepurse

[MIT License](LICENSE)

## about

This site is made up of static files, hosted by GitHub, that fetch market info from CoinMarketCap.com

However, to use the CoinMarketCap API efficiently, and perform direct GET requests, we need to their internal ids for all possible currencies.

Looking this up is slow and returns a payload of 1.3MB (as of January 2018), so instead we cache a lookup of Symbol -> CoinMarketCap's ID in the space of ~30KB.

This cached lookup `coinmarketcap.json` is updated daily via cronjob. To run said cronjob:

```
# install dependencies
virtualenv venv
source venv/bin/activate
pip install -r py/requirements.txt

# see cronjob.sh for more info
```
