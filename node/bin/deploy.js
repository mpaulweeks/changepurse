import { updateLambda } from '../src/s3.js';
import { zipLambda } from "../src/zip.js";

(async () => {
  const file = await zipLambda();
  await updateLambda(file);
  console.log('deploy done');
})();
