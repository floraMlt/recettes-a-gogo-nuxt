import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing ingredient ID in route'
    })
  }

  try {
    const deletedIngredient = await prisma.ingredient.delete({
      where: { id },
      select: {
        id: true,
        title: true
      }
    })

    return { message: 'Ingredient deleted', ingredient: deletedIngredient }
  } catch {
    throw createError({
      statusCode: 404,
      message: `Ingredient with id ${id} not found`
    })
  }
})
