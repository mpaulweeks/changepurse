import 'dotenv/config'
import fetch from 'node-fetch';
import { fileToString } from './file.js';

const RequestInfo = {
  Url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  Headers: {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
  },
  QueryParams: new URLSearchParams({
    'start': 1,
    'limit': 5000,
    'convert': 'USD'
  }).toString(),
};

export async function fetchData() {
  const url = `${RequestInfo.Url}?${RequestInfo.QueryParams}`;
  const resp = await fetch(url, {
    headers: RequestInfo.Headers,
  });
  const data = await resp.json();
  return data;
}

export function reduceCoins(coins) {
  return coins.reduce((obj, elm) => {
    obj[elm.symbol] = {
      name: elm.name,
      USD: elm.quote.USD.price,
    };
    return obj;
  }, {});
}

export async function apiToFiles() {
  console.log('lambda started');
  const resp = await fetchData();
  console.log('fetched data');
  const coins = reduceCoins(resp.data);
  console.log('coins founds:', Object.keys(coins).length);

  const files = fileToString('price', {
    updated: new Date().toISOString(),
    coins,
  });
  return files;
}
