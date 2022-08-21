import fs from 'fs';
import rimraf from 'rmrf';
import { zip } from 'zip-a-folder';
import { uploadToS3 } from './s3';

export async function zipLambda() {
  // remove tmp
  await rimraf('./tmp');

  // have to make it outside of current dir to avoid infinite loop
  await zip('.', '../lambda.zip');

  // move lambda to tmp
  await fs.promises.mkdir('./tmp');
  await fs.promises.rename('../lambda.zip', './tmp/lambda.zip');
}

export async function streamToS3() {
  const files = [{
    key: 'lambda.zip',
    value: createReadStream('./tmp/lambda.zip'),
  }];
  await uploadToS3(files);
}
