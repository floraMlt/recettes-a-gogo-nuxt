import prisma from '../../utils/prisma'
import { getSignedImageUrl } from '../../utils/getSignedImageUrl'
import { getServerSession } from '#auth'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
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
