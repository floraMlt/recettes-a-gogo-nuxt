import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../utils/prisma'

export default NuxtAuthHandler({
  pages: {
    signIn: '/session'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: '(hint: toto@mail.com)'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '(hint: hunter2)'
        }
      },

      async authorize(credentials) {
        const { email, password } = credentials
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const isValid = await bcrypt.compare(password, user.hashedPassword)
        if (!isValid) return null

        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id
      }
      return session
    }
  }
})
