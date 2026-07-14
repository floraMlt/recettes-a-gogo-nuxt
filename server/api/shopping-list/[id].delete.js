import { getServerSession } from '#auth'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
    })
  }

  const id = getRouterParam(event, 'id')

  const item = await prisma.shoppingListItem.findUnique({
    where: { id }
  })

  if (!item) {
    throw createError({
      statusCode: 404,
      message: 'Shopping list item not found'
    })
  }

  if (item.userId !== session.user.id) {
    throw createError({
      statusCode: 403,
      message: 'Not authorized to delete this item'
    })
  }

  await prisma.shoppingListItem.delete({
    where: { id }
  })

  return { success: true }
})
