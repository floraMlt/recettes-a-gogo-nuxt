import { Unit } from '@prisma/client'
import prisma from '../../utils/prisma'
import { z } from 'zod'
import { getServerSession } from '#auth'

const createIngredientSchema = z.object({
  title: z.string().min(2),
  unit: z.nativeEnum(Unit)
})

export default defineEventHandler(async (request) => {
  const body = await readBody(request)

  const parsed = createIngredientSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const { title, unit } = parsed.data
  const session = await getServerSession(request)

  const newIngredient = await prisma.ingredient.create({
    data: {
      title,
      unit,
      createdBy: {
        connect: {
          id: session.user.id
        }
      }
    },
    select: {
      id: true,
      title: true,
      unit: true
    }
  })

  return newIngredient
})
