import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const ingredientItem = await prisma.ingredient.findUnique(
        {
            where: {
                id: event.context.params.id
            },
            select: {
                id: true,
                title: true,
                unit: true
            }
        }
    )
    return ingredientItem
})
