import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const tagItem = await prisma.tag.findUnique(
        {
            where: {
                id: event.context.params.id
            },
            select: {
                id: true,
                name: true
            }
        }
    )
    return tagItem
})
