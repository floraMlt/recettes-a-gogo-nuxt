import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3Client from '../../utils/s3'

export default defineEventHandler(async (event) => {
  const fileName = getRouterParam(event, 'fileName')

  if (!fileName) {
    throw createError({
      statusCode: 400,
      message: 'File name is required'
    })
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 7 * 24 * 60 * 60
    })

    return {
      url: signedUrl,
      expiresIn: 7 * 24 * 60 * 60
    }
  } catch (error) {
    console.error('Failed to generate signed URL:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate signed URL'
    })
  }
})
