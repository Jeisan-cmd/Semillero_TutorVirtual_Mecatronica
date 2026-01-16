import { PrismaClient, Role } from '@prisma/client'
import { verifyToken } from '../utils/jwt'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

interface JwtPayload {
  id: string
  role: Role
}

export default async function authMiddleware(event: H3Event) {
  try {
    const authHeader = event.node.req.headers.authorization

    if (!authHeader) {
      throw new Error('No token provided')
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new Error('Malformed token')
    }

    const decoded = verifyToken(token) as JwtPayload

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    event.context.user = user
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
}
