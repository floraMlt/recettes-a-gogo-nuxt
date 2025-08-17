import prisma from "../../utils/prisma"
import { z } from "zod"

const createTagSchema = z.object({
  name: z.string().min(2).max(100)
})

export default defineEventHandler(async (request) => {
  const body = await readBody(request)

  const parsed = createTagSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(", ")
    })
  }

  const { name } = parsed.data

  const newTag = await prisma.tag.create({
    data: {
      name
    },
    select: {
      id: true,
      name: true
    }
  })

  return newTag
})
