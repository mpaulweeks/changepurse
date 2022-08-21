import { streamToS3, zipLambda } from "./src/zip.js";

(async () => {
  await zipLambda();
  await streamToS3();
  console.log('deployed');
})();
