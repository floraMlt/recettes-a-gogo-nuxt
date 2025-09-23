import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineNitroPlugin(async () => {
  console.log('Checking for default admin user...')
  const userCount = await prisma.user.count()
  const hashedPassword = await bcrypt.hash('adminAdmin', 12)

  if (userCount === 0) {
    await prisma.user.create({
      data: {
        email: 'flora@admin.com',
        firstName: 'Flora',
        lastName: 'Admin',
        hashedPassword,
        isAdmin: true
      }
    })
  }
})
