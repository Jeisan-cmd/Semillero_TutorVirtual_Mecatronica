import { PrismaClient } from '@prisma/client'
import { verifyToken } from './jwt'
import { createError, H3Event } from 'h3'

const prisma = new PrismaClient()

export async function requireAuth(event: H3Event) {
  const authHeader = event.node.req.headers.authorization
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'No token' })
  }

  const [, token] = authHeader.split(' ')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Malformed token' })
  }

  const decoded = verifyToken(token)

  const usuario = await prisma.usuario.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      correo: true,
      rol: true
    }
  })

  if (!usuario) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no existe' })
  }

  event.context.user = usuario
  return usuario
}
