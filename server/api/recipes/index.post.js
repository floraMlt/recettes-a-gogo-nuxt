import { Category } from '@prisma/client'
import prisma from '../../utils/prisma'
import { z } from 'zod'
import { getServerSession } from '#auth'

const registerRecipesSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2).optional(),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string(),
        quantity: z.number().min(0)
      })
    )
    .min(1),
  instructions: z.array(z.string().min(2)).min(1),
  category: z.nativeEnum(Category),
  preparationTime: z.number().optional(),
  cookingTime: z.number().optional(),
  isPublic: z.boolean().default(false),
  favorites: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string(),
  imageFileName: z.string().optional()
})

export default defineEventHandler(async (request) => {
  const session = await getServerSession(request)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
    })
  }

  const body = await readBody(request)
  const parsed = registerRecipesSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const {
    title,
    description,
    instructions,
    category,
    ingredients,
    favorites,
    preparationTime,
    cookingTime,
    isPublic,
    tags,
    imageFileName
  } = parsed.data

  const newRecipe = await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: {
        title,
        description,
        instructions,
        authorId: session.user.id,
        category,
        favorites,
        preparationTime,
        cookingTime,
        isPublic,
        imageFileName,
        tags:
          tags && tags.length > 0
            ? {
                create: tags.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName },
                      create: { name: tagName }
                    }
                  }
                }))
              }
            : undefined
      }
    })

    const recipeIngredients = ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId,
      quantity: ingredient.quantity,
      recipeId: recipe.id
    }))

    await tx.recipeIngredient.createMany({
      data: recipeIngredients
    })

    const recipeIngredientsWithDetails = await tx.recipeIngredient.findMany({
      where: { recipeId: recipe.id },
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

    const recipeTags = await tx.recipeTag.findMany({
      where: { recipeId: recipe.id },
      include: { tag: true }
    })

    return {
      ...recipe,
      ingredients: recipeIngredientsWithDetails,
      tags: recipeTags.map((t) => t.tag)
    }
  })

  return newRecipe
})
