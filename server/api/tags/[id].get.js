import prisma from '../../utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
    })
  }

  const tagItem = await prisma.tag.findUnique({
    where: {
      id: event.context.params.id
    },
    select: {
      id: true,
      name: true
    }
  })
  return tagItem
})
