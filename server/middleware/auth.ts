import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
  // Rutas públicas
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register'
  ]

  if (publicRoutes.includes(event.path)) {
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

    // 👇 inyectamos el usuario en el event
    event.context.auth = payload
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token inválido'
    })
  }
})
