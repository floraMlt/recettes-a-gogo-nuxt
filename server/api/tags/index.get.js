import prisma from '../../utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  // const session = await getServerSession(event)
  // if (!session) {
  //     throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  // }

  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true
    }
  })

  return tags
})
