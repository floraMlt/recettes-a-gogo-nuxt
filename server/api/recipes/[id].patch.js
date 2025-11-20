import { Category } from '@prisma/client'
import prisma from '../../utils/prisma'
import { z } from 'zod'

const registerRecipesSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string(),
        quantity: z.number().min(0)
      })
    )
    .optional(),
  instructions: z.array(z.string().min(2)).optional(),
  category: z.nativeEnum(Category).optional(),
  preparationTime: z.number().optional(),
  cookingTime: z.number().optional(),
  isPublic: z.boolean().optional(),
  favorites: z.boolean().optional(),
  userId: z.string().optional(),
  authorId: z.string().optional()
})

export default defineEventHandler(async (request) => {
  const id = getRouterParam(request, 'id')
  const body = await readBody(request)
  console.log('Request body:', body)

  const parsed = registerRecipesSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const data = parsed.data

  console.log('Updating recipe with data:', data)

  const dataToUpdate = {}
  const updatableFields = [
    'title',
    'description',
    'instructions',
    'category',
    'preparationTime',
    'cookingTime',
    'isPublic',
    'authorId'
  ]

  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      dataToUpdate[field] = data[field]
    }
  }

  const updatedRecipe = await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.update({
      where: { id },
      data: dataToUpdate
    })

    if (data.userId !== undefined && data.favorites !== undefined) {
      if (data.favorites) {
        await prisma.favorite.upsert({
          where: {
            userId_recipeId: {
              userId: data.userId,
              recipeId: id
            }
          },
          update: {},
          create: {
            userId: data.userId,
            recipeId: id
          }
        })
      } else {
        await prisma.favorite.deleteMany({
          where: {
            userId: data.userId,
            recipeId: id
          }
        })
      }
    }

    if (data.ingredients !== undefined) {
      const newIngredients = data.ingredients

      const existing = await tx.recipeIngredient.findMany({
        where: { recipeId: id }
      })

      const existingMap = new Map(existing.map((i) => [i.ingredientId, i]))
      const newMap = new Map(newIngredients.map((i) => [i.ingredientId, i]))

      const toCreate = []
      const toUpdate = []
      const toDelete = []

      for (const ing of newIngredients) {
        if (!existingMap.has(ing.ingredientId)) {
          toCreate.push({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            recipeId: id
          })
        }
      }

      for (const ing of existing) {
        if (!newMap.has(ing.ingredientId)) {
          toDelete.push(ing.id)
        }
      }

      for (const ing of newIngredients) {
        const current = existingMap.get(ing.ingredientId)
        if (current && current.quantity !== ing.quantity) {
          toUpdate.push({ id: current.id, quantity: ing.quantity })
        }
      }

      if (toCreate.length > 0) {
        await tx.recipeIngredient.createMany({ data: toCreate })
      }

      for (const u of toUpdate) {
        await tx.recipeIngredient.update({
          where: { id: u.id },
          data: { quantity: u.quantity }
        })
      }

      if (toDelete.length > 0) {
        await tx.recipeIngredient.deleteMany({
          where: { id: { in: toDelete } }
        })
      }
    }

    const recipeIngredients = await tx.recipeIngredient.findMany({
      where: { recipeId: id },
      select: {
        id: true,
        ingredient: {
          select: {
            id: true,
            title: true,
            unit: true
          }
        },
        quantity: true
      }
    })

    return {
      ...recipe,
      ingredients: recipeIngredients
    }
  })

  return updatedRecipe
})
