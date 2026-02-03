import { getHeader, createError } from 'h3'
import { verifyToken } from './jwt'

export function requireAuth(event: any) {
  const auth = getHeader(event, 'authorization')

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token requerido'
    })
  }

  const token = auth.replace('Bearer ', '')
  const payload = verifyToken(token)
  event.context.user = payload
  return payload
}
