import { createError } from 'h3'
import { Rol } from '@prisma/client'

export default async function requireRole(
  event: any,
  roles: Rol[]
) {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado'
    })
  }

  if (!roles.includes(user.rol)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No autorizado'
    })
  }
}
