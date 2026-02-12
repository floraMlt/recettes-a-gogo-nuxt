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

  const userId = getQuery(event).userId

  const recipeItem = await prisma.recipe.findUnique({
    where: {
      id: event.context.params.id
    },
    select: {
      id: true,
      title: true,
      description: true,
      instructions: true,
      updatedAt: true,
      preparationTime: true,
      cookingTime: true,
      category: true,
      isPublic: true,
      imageFileName: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true
            }
          }
        }
      },
      ingredients: {
        select: {
          quantity: true,
          ingredient: {
            select: {
              id: true,
              title: true,
              unit: true
            }
          }
        }
      },
      favorites: {
        where: { userId: userId },
        select: { userId: true }
      }
    }
  })

  if (!recipeItem)
    throw createError({ statusCode: 404, message: 'Recipe not found' })

  return {
    ...recipeItem,
    favorite: recipeItem.favorites.length > 0,
    imageUrl: await getSignedImageUrl(recipeItem.imageFileName)
  }
})
