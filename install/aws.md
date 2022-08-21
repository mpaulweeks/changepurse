# aws resources

- [S3 Bucket](https://s3.console.aws.amazon.com/s3/buckets/mpaulweeks-changepurse?region=us-east-1) for storing `lambda.zip` and `price.json`
- [Lambda Function](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/changepurse-scrape) for updating `price.json`
- [EventBridge Trigger](https://us-east-1.console.aws.amazon.com/events/home?region=us-east-1#/eventbus/default/rules/changepurse-scrape-trigger) to act as cron and regularly trigger the Lambda Function
