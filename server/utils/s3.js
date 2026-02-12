import { S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.MINIO_EXTERNAL_URL,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
})

export default s3Client
