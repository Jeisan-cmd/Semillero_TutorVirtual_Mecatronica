import { loginUser } from '~/server/services/auth/auth.service'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('hit /api/auth/login body:', body)

  if (!body?.correo || !body?.contrasena) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos'
    })
  }

  return await loginUser(body.correo, body.contrasena)
})
