import 'dotenv/config'
import AWS from 'aws-sdk';

const AwsLambdaFunctionName = process.env.AWS_LAMBDA_FUNCTION_NAME;
const AwsBucket = process.env.AWS_BUCKET;
const AwsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

export async function uploadToS3(files) {
  const s3 = new AWS.S3(AwsConfig);
  for (const file of files) {
    await s3.upload({
      Bucket: AwsBucket,
      Key: file.key,
      Body: file.value,
    }).promise();
    console.log('uploaded:', file.key);
  }
}

export async function updateLambda(file) {
  await uploadToS3([file]);
  const lambda = new AWS.Lambda(AwsConfig);
  await lambda.updateFunctionCode({
    FunctionName: AwsLambdaFunctionName,
    S3Key: file.key,
    S3Bucket: AwsBucket,
  }).promise();
  console.log('updated:', file.key);
}
