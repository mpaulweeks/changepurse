import { fetchData, reduceCoins } from "./src/api.js";
import { fileToString } from "./src/file.js";
import { uploadToS3 } from "./src/s3.js";

export async function genFiles() {
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

// expose for lambda
export async function lambda() {
  const files = await genFiles();
  await uploadToS3(files);
  console.log('lambda done');
};
