import { defineEventHandler, getCookie, createError } from 'h3'
import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  if (!url.startsWith('/api')) return

  if (
    url.startsWith('/api/auth/login') ||
    url.startsWith('/api/auth/register')
  ) {
    return
  }

  const token = getCookie(event, 'token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  }

  event.context.auth = verifyToken(token)
})
