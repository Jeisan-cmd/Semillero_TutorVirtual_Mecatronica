import { defineEventHandler } from 'h3'
import requireRole  from '~/server/guards/requireRole'
import { Rol } from '@prisma/client'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireRole(event, [Rol.SUPERADMIN, Rol.ADMIN])

  const usuarios = await prisma.usuario.findMany()

  return usuarios
})
