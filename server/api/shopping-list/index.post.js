import { Unit } from '@prisma/client'
import { z } from 'zod'
import { getServerSession } from '#auth'
import prisma from '../../utils/prisma'

const shoppingListItemSchema = z.object({
  title: z.string(),
  quantity: z.number().min(0),
  unit: z.nativeEnum(Unit),
  recipeTitle: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
    })
  }

  const body = await readBody(event)
  const parsed = shoppingListItemSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const shoppingItem = await prisma.shoppingListItem.create({
    data: {
      ...parsed.data,
      userId: session.user.id
    }
  })

  return shoppingItem
})
