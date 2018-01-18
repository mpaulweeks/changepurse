import json

with open('raw.json') as f:
  market = json.load(f)
  ticker_names = {
    t['symbol']: t['name']
    for t in market
  }
with open('ticker_names.json', 'wb') as f:
  json.dump(ticker_names, f, separators=(',', ':'))
