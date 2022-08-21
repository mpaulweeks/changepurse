import 'dotenv/config'
import fs from 'fs';
import fetch from 'node-fetch';
import stringify from 'json-stable-stringify';


const apiKey = process.env.COINMARKETCAP_API_KEY;
const RequestInfo = {
  Url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  Headers: {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': apiKey,
  },
  QueryParams: new URLSearchParams({
    'start': 1,
    'limit': 5000,
    'convert': 'USD'
  }).toString(),
};

async function fetchData() {
  const url = `${RequestInfo.Url}?${RequestInfo.QueryParams}`;
  const resp = await fetch(url, {
    headers: RequestInfo.Headers,
  });
  const data = await resp.json();
  return data;
}

function reduceCoins(coins) {
  return coins.reduce((obj, elm) => {
    obj[elm.symbol] = {
      name: elm.name,
      USD: elm.quote.USD.price,
    };
    return obj;
  }, {});
}

async function writeToFile(name, data) {
  const folder = 'tmp';
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
  await fs.promises.writeFile(`${folder}/${name}.min.json`, stringify(data));
  await fs.promises.writeFile(`${folder}/${name}.json`, stringify(data, { space: 2, }));
}

(async () => {
  const resp = await fetchData();
  // console.log(resp);
  const coins = reduceCoins(resp.data);
  console.log('coins founds:', Object.keys(coins).length);
  await writeToFile('price', {
    updated: new Date().toISOString(),
    coins,
  });
  console.log('done');
})();
