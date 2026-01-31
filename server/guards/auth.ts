import { getHeader, createError, H3Event } from 'h3'
import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
  const path = event.path.trim() // 👈 CLAVE

  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register'
  ]

  if (publicRoutes.includes(path)) {
    return
  }

  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const payload = verifyToken(token)
    event.context.auth = payload
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token inválido'
    })
  }
})
