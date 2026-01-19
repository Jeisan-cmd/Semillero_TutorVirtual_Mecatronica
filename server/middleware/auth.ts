import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../utils/jwt'
import type { H3Event } from 'h3'
import { createError } from 'h3'

const prisma = new PrismaClient()

export default async function authMiddleware(event: H3Event) {
  const url = event.node.req.url || ''

  // 🚨 IMPORTANTE: solo proteger API
  if (!url.startsWith('/api')) {
    return
  }

  // Rutas públicas dentro de la API
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/news'
  ]

  if (publicPaths.some(path => url.startsWith(path))) {
    return
  }

  try {
    const authHeader = event.node.req.headers.authorization
    if (!authHeader) throw new Error('No token')

    const [, token] = authHeader.split(' ')
    if (!token) throw new Error('Malformed token')

    const decoded = verifyToken(token)

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, correo: true, rol: true }
    })

    if (!usuario) throw new Error('Usuario no existe')

    // ✅ Contrato único
    event.context.user = usuario
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
}
