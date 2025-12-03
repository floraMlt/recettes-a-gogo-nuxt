import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = getQuery(event).userId

  const recipeItem = await prisma.recipe.findUnique({
    where: {
      id: event.context.params.id
    },
    select: {
      id: true,
      title: true,
      description: true,
      instructions: true,
      updatedAt: true,
      preparationTime: true,
      cookingTime: true,
      category: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true
            }
          }
        }
      },
      ingredients: {
        select: {
          quantity: true,
          ingredient: {
            select: {
              id: true,
              title: true,
              unit: true
            }
          }
        }
      },
      favorites: {
        where: { userId: userId },
        select: { userId: true }
      }
    }
  })

  if (!recipeItem)
    throw createError({ statusCode: 404, message: 'Recipe not found' })

  return {
    ...recipeItem,
    favorite: recipeItem.favorites.length > 0
  }
})
