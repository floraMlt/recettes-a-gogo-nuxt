import prisma from '../../utils/prisma'
// import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    // const session = await getServerSession(event)
    // if (!session) {
    //     throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
    // }

    const recipes = await prisma.recipe.findMany()
    return recipes
})
