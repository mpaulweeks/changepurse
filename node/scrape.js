import { genFiles } from "./index.js";
import { writeToFile } from "./src/file.js";

(async () => {
  const files = await genFiles();
  await writeToFile(files);
  console.log('index done');
})();
