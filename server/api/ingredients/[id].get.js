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

  const ingredientItem = await prisma.ingredient.findUnique({
    where: {
      id: event.context.params.id
    },
    select: {
      id: true,
      title: true,
      unit: true
    }
  })
  return ingredientItem
})
