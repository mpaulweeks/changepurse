import 'dotenv/config'
import fs from 'fs';
import fetch from 'node-fetch';
import stringify from 'json-stable-stringify';
import AWS from 'aws-sdk';

const AwsBucket = process.env.AWS_BUCKET;
const AwsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};
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

function fileToString(name, fileData) {
  return [{
    key: `${name}.min.json`,
    value: stringify(fileData),
  },  {
    key: `${name}.json`,
    value: stringify(fileData, { space: 2, }),
  }];
}

async function writeToFile(files) {
  const folder = 'tmp';
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
  for (const file of files) {
    await fs.promises.writeFile(`${folder}/${file.key}`, file.value);
  }
}

async function uploadToS3(files) {
  const s3 = new AWS.S3(AwsConfig);
  for (const file of files) {
    await s3.upload({
      Bucket: AwsBucket,
      Key: file.key,
      Body: file.value,
    }).promise();
  }
}

(async () => {
  const resp = await fetchData();
  // console.log(resp);
  const coins = reduceCoins(resp.data);
  console.log('coins founds:', Object.keys(coins).length);

  const files = fileToString('price', {
    updated: new Date().toISOString(),
    coins,
  });
  await writeToFile(files);
  await uploadToS3(files);
  console.log('done');
})();
