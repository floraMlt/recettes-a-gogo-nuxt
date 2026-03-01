import prisma from '../../utils/prisma'
import { getSignedImageUrl } from '../../utils/getSignedImageUrl'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
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
