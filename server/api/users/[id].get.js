import prisma from '../../utils/prisma'
import s3Client from '../../utils/s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getServerSession } from '#auth'

async function getSignedImageUrl(fileName) {
  if (!fileName) return null

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName
    })

    return await getSignedUrl(s3Client, command, {
      expiresIn: 7 * 24 * 60 * 60
    })
  } catch (error) {
    console.error('Failed to generate signed URL:', error)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Utilisateur non authentifié'
    })
  }

  const userItem = await prisma.user.findUnique({
    where: {
      id: event.context.params.id
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true,
      imageFileName: true
    }
  })

  return {
    ...userItem,
    imageUrl: await getSignedImageUrl(userItem.imageFileName)
  }
})
