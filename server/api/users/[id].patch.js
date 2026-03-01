import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { getServerSession } from '#auth'

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  isAdmin: z.boolean().optional(),
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

  const id = getRouterParam(request, 'id')
  const body = await readBody(request)

  const parsed = updateUserSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(', ')
    })
  }

  const { password, ...rest } = parsed.data

  const dataToUpdate = { ...rest }

  if (password) {
    dataToUpdate.hashedPassword = await bcrypt.hash(password, 12)
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true,
      imageFileName: true
    }
  })

  return updatedUser
})
