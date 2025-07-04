import prisma from '../../utils/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
    }

    const users = await prisma.user.findMany(
        {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        }
    )
    return users
})
