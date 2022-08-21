import { apiToFiles } from './src/api.js';
import { uploadToS3 } from "./src/s3.js";

// expose for lambda
export async function lambda() {
  const files = await apiToFiles();
  await uploadToS3(files);
  console.log('lambda done');
};
