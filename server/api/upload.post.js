import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import s3Client from '../utils/s3'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded'
    })
  }

  const file = form[0]

  const fileExtension = file.filename.split('.').pop()
  const fileName = `${randomUUID()}.${fileExtension}`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.data,
    ContentType: file.type
  })

  try {
    await s3Client.send(command)

    //  const fileUrl = `${process.env.MINIO_EXTERNAL_URL}/${process.env.S3_BUCKET_NAME}/${fileName}`

    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName
    })

    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 7 * 24 * 60 * 60
    })

    return {
      success: true,
      url: signedUrl,
      fileName,
      expiresIn: 7 * 24 * 60 * 60
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Upload failed'
    })
  }
})
