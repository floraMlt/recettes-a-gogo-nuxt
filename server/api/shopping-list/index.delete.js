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

  await prisma.shoppingListItem.deleteMany({
    where: {
      userId: session.user.id
    }
  })

  return { success: true }
})
