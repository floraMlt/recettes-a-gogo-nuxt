import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
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
      tags: true,
      ingredients: {
        select: {
          quantity: true,
          ingredient: {
            select: {
              id: true,
              title: true
            }
          }
        }
      },
      tags: true,
      favorites: true
    }
  })

  return recipeItem
})
