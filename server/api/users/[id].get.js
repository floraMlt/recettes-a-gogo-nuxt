import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const userItem = await prisma.user.findUnique({
    where: {
      id: event.context.params.id
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true
    }
  })
  return userItem
})
