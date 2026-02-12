import prisma from '../../utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Utilisateur non authentifié'
    })
  }

  const query = getQuery(event)
  const searchTerm = query.search

  const whereClause = searchTerm
    ? {
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }
    : {}

  const ingredients = await prisma.ingredient.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      unit: true
    }
  })

  return ingredients
})
