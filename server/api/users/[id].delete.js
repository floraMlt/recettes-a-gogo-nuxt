import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
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
