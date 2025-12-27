import prisma from '../../utils/prisma'
import { z } from 'zod'

const updateTagSchema = z.object({
  name: z.string().min(2)
})

export default defineEventHandler(async (request) => {
  const id = getRouterParam(request, 'id')
  const body = await readBody(request)

  const parsed = updateTagSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const updatedTag = await prisma.tag.update({
    where: { id },
    data: {
      name: parsed.data.name
    },
    select: {
      id: true,
      name: true
    }
  })

  return updatedTag
})
