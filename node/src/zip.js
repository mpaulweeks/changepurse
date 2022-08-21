import fs from 'fs';
import rimraf from 'rmrf';
import { zip } from 'zip-a-folder';

export async function zipLambda() {
  // remove tmp
  await rimraf('./tmp');

  // have to make it outside of current dir to avoid infinite loop
  await zip('.', '../lambda.zip');

  // move lambda to tmp
  await fs.promises.mkdir('./tmp');
  await fs.promises.rename('../lambda.zip', './tmp/lambda.zip');

  const file = {
    key: 'lambda.zip',
    value: fs.createReadStream('./tmp/lambda.zip'),
  };
  console.log('created:', file.key);
  return file;
}
