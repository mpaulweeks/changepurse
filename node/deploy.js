import { uploadToS3 } from './src/s3.js';
import { zipLambda } from "./src/zip.js";

(async () => {
  const files = await zipLambda();
  await uploadToS3(files);
  console.log('deploy done');
})();
