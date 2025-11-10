import { Category } from '@prisma/client'
import prisma from '../../utils/prisma'
import { z } from 'zod'

const registerRecipesSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
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
  authorId: z.string()
})

export default defineEventHandler(async (request) => {
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
    authorId
  } = parsed.data

  const newRecipe = await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: {
        title,
        description,
        instructions,
        authorId,
        category,
        favorites,
        preparationTime,
        cookingTime,
        isPublic,
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
