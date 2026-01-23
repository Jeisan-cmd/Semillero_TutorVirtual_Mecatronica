import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import  requireRole  from '~/server/guards/requireRole'
import { Rol } from '@prisma/client'

export default defineEventHandler(async (event) => {
  // 🔐 Seguridad
  requireAuth(event)
  requireRole(event, [Rol.ADMIN, Rol.SUPERADMIN])

  // 📥 Body
  const body = await readBody(event)
  const { titulo, contenido, orden, asignaturaId } = body

  // 🛑 Validación estricta
  if (!titulo || !contenido || orden === undefined || !asignaturaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos'
    })
  }

  // 👤 Usuario autenticado
  const user = event.context.user
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuario no autenticado'
    })
  }

  // 💾 Crear módulo
  const modulo = await prisma.modulo.create({
  data: {
    titulo,
    contenido,
    orden,
    creadoPorId: user.id
  }
})

  return modulo
})
