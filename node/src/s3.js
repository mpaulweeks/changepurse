import 'dotenv/config'
import AWS from 'aws-sdk';

const AwsBucket = process.env.AWS_BUCKET;
const AwsConfig = {
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
  }
}
