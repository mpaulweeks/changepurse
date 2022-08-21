import 'dotenv/config'
import fs from 'fs';
import stringify from 'json-stable-stringify';

export function fileToString(name, fileData) {
  return [{
    key: `${name}.min.json`,
    value: stringify(fileData),
  },  {
    key: `${name}.json`,
    value: stringify(fileData, { space: 2, }),
  }];
}

export async function writeToFile(files) {
  const folder = 'tmp';
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
  for (const file of files) {
    await fs.promises.writeFile(`${folder}/${file.key}`, file.value);
  }
}
