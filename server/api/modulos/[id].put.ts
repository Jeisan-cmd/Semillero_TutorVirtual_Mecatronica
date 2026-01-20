import { defineEventHandler, readBody } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/requireRole'
import { Rol } from '@prisma/client'

export default defineEventHandler(async (event) => {
  requireRole(event, [Rol.ADMIN, Rol.SUPERADMIN])

  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  return prisma.modulo.update({
    where: { id },
    data: body
  })
})
