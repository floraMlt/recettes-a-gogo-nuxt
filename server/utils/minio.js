import { Client } from 'minio'

export const MINIO_EXTERNAL_URL =
  process.env.MINIO_EXTERNAL_URL ||
  `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`

export const minio = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY_ID,
  secretKey: process.env.S3_SECRET_ACCESS_KEY
})
