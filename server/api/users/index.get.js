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

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true,
      imageFileName: true
    }
  })

  const usersWithSignedUrls = await Promise.all(
    users.map(async (user) => {
      const imageUrl = await getSignedImageUrl(user.imageFileName)
      return {
        ...user,
        imageUrl
      }
    })
  )

  return usersWithSignedUrls
})
