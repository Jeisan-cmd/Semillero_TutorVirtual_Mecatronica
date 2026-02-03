import { defineEventHandler, createError, getRouterParam } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const user: any = requireAuth(event)
    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({ statusCode: 400, statusMessage: 'Id requerido' })
    }

    const id = Number(idParam)

    const session = await prisma.chatSession.findUnique({ where: { id } })

    if (!session) {
      throw createError({ statusCode: 404, statusMessage: 'Sesión no encontrada' })
    }

    // Solo puede eliminar el propietario o un admin/superadmin
    if (session.usuarioId !== Number(user.id) && user.rol !== 'SUPERADMIN' && user.rol !== 'ADMIN') {
      throw createError({ statusCode: 403, statusMessage: 'No autorizado para eliminar esta sesión' })
    }

    await prisma.chatSession.delete({ where: { id } })

    return { ok: true }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al eliminar sesión'
    })
  }
})
