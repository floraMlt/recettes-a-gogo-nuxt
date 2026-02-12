import prisma from '../../utils/prisma'
import s3Client from '../../utils/s3'
import { getServerSession } from '#auth'
import { getQuery } from 'h3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

  const query = getQuery(event)
  const authorId = query.authorId
  const publicRecipes = query.isPublic
  const limit = query.limit ? Number(query.limit) : undefined
  const sort = query.sort
  const search = query.search
  const favoritesOnly = query.favoritesOnly === 'true'
  const favoriteUserId = query.favoriteUserId

  const isAdmin = session?.user?.isAdmin === true
  const isOwner = authorId === session?.user?.id

  let whereClause = {}

  if (authorId) {
    if (isOwner || isAdmin) {
      whereClause.authorId = authorId
    } else {
      whereClause.authorId = authorId
      whereClause.isPublic = true
    }
  }

  if (publicRecipes !== undefined) {
    whereClause.isPublic = Boolean(publicRecipes)
  }

  if (search) {
    whereClause.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: search,
          mode: 'insensitive'
        }
      }
    ]
  }

  if (favoritesOnly && favoriteUserId) {
    whereClause.favorites = {
      some: {
        userId: favoriteUserId
      }
    }
  }

  let orderBy = undefined
  if (sort === 'recent') {
    orderBy = { createdAt: 'desc' }
  }

  const recipes = await prisma.recipe.findMany({
    where: whereClause,
    ...(orderBy && { orderBy }),
    ...(limit && { take: limit })
  })

  const recipesWithSignedUrls = await Promise.all(
    recipes.map(async (recipe) => {
      const imageUrl = await getSignedImageUrl(recipe.imageFileName)
      return {
        ...recipe,
        imageUrl
      }
    })
  )

  return recipesWithSignedUrls
})
