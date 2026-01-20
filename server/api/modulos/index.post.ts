import { defineEventHandler, readBody } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { requireRole } from '~/server/utils/requireRole'
import { Rol } from '@prisma/client'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  requireRole(event, [Rol.ADMIN, Rol.SUPERADMIN])

  const body = await readBody(event)
  return body
})
