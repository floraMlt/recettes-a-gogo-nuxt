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

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing tag ID in route'
    })
  }

  try {
    const deletedTag = await prisma.tag.delete({
      where: { id },
      select: {
        id: true,
        name: true
      }
    })

    return { message: 'Tag deleted', tag: deletedTag }
  } catch {
    throw createError({
      statusCode: 404,
      message: `Tag with id ${id} not found`
    })
  }
})
