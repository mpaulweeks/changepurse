# changepurse-scraper

```env
AWS_REGION=
AWS_LAMBDA_FUNCTION_NAME=
AWS_BUCKET=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
COINMARKETCAP_API_KEY=
```

```bash
# install dependencies
nvm install $(cat .nvmrc)
nvm use
npm i

# execute
npm run scrape

# output
cat tmp/price.js
cat tmp/price.min.js
```
