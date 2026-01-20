import { defineEventHandler, readBody } from 'h3'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const { correo, contraseña } = await readBody(event)

  // validar usuario...
  return {
    token: signToken({
      id: 1,
      rol: 'ADMIN'
    })
  }
})
