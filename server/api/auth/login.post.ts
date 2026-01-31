import { loginUser } from '~/server/services/auth/auth.service'
import { createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.correo || !body?.contrasena) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos'
    })
  }

  return await loginUser(body.correo, body.contrasena)
})
