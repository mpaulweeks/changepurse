import { handler } from "./lambda.js";

(async () => {
  await handler();
  console.log('index done');
})();
