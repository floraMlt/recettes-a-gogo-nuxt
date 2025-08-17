import prisma from "../../utils/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"

const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  isAdmin: z.boolean().optional().default(false)
})

export default defineEventHandler(async (request) => {
  const body = await readBody(request)

  const parsed = registerUserSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors.map((err) => err.message).join(", ")
    })
  }

  const { email, firstName, lastName, isAdmin } = parsed.data

  const hashedPassword = await bcrypt.hash(body.password, 12)

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      hashedPassword,
      isAdmin
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true
    }
  })

  return newUser
})
