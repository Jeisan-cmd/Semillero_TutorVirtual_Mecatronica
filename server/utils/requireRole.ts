import { createError } from 'h3'
import type { Rol } from '@prisma/client'

export function requireRole(event: any, roles: Rol[]) {
  const user = event.context.user

  if (!user || !roles.includes(user.rol)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acceso denegado'
    })
  }
}
