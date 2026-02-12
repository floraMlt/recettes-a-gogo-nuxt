import prisma from '../../utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing user ID in route'
    })
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true
      }
    })

    return { message: 'User deleted', user: deletedUser }
  } catch {
    throw createError({
      statusCode: 404,
      message: `User with id ${id} not found`
    })
  }
})
