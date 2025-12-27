import { Unit } from '@prisma/client'
import prisma from '../../utils/prisma'
import { z } from 'zod'

const updateIngredientSchema = z.object({
  title: z.string().min(2),
  unit: z.nativeEnum(Unit)
})

export default defineEventHandler(async (request) => {
  const id = getRouterParam(request, 'id')
  const body = await readBody(request)

  const parsed = updateIngredientSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const updatedIngredient = await prisma.ingredient.update({
    where: { id },
    data: {
      title: parsed.data.title,
      unit: parsed.data.unit
    },
    select: {
      id: true,
      title: true,
      unit: true
    }
  })

  return updatedIngredient
})
