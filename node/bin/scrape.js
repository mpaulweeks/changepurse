import { apiToFiles } from '../src/api.js';
import { writeToFile } from "../src/file.js";

(async () => {
  const files = await apiToFiles();
  await writeToFile(files);
  console.log('local scrape done');
})();
