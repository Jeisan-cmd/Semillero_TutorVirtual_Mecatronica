import { defineEventHandler } from 'h3'
import { prisma } from '~/server/utils/prisma'
import  requireRole  from '~/server/guards/requireRole'
import { Rol } from '@prisma/client'

export default defineEventHandler(async (event) => {
  requireRole(event, [Rol.ADMIN, Rol.SUPERADMIN])

  const id = Number(event.context.params?.id)

  return prisma.modulo.delete({
    where: { id }
  })
})
