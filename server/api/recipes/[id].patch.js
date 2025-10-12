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
  favorites: z.array(z.string()).optional()
})

export default defineEventHandler(async (request) => {
  const id = getRouterParam(request, 'id')
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
    isPublic
  } = parsed.data

  const newRecipe = await prisma.$transaction(async (tx) => {
    // ici il faut mettre que les champs à modifier et pas tous les champs sinon ils vont être écrasés
    const recipe = await tx.recipe.update({
      where: { id },
      data: {
        title,
        description,
        instructions,
        authorId: 'cmd3efb4y0000j668lz6gw4bt',
        category,
        favorites,
        preparationTime,
        cookingTime,
        isPublic
      }
    })

    const recipeIngredients = ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId,
      quantity: ingredient.quantity,
      recipeId: recipe.id
    }))

    // get les recipe ingredients actuels et faire un comparatif pour chaque pour voir quoi faire
    // boucle sur les ingrédients et
    // regarde liste d'ingredients, s'il y a des nouveaux ingrédients, des ingrédients supprimés, modifiés (quantity) ->
    // regrouper tous les ingrédients à update, ceux à delete et ceux à créér et faire un requête prisma pour chaque cas
    await tx.recipeIngredient.createMany({
      data: recipeIngredients
    })

    // A voir pour ne pas refaire un get et déduire toutes les infos actuelles
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

    return {
      ...recipe,
      ingredients: recipeIngredientsWithDetails
    }
  })

  return newRecipe
})
