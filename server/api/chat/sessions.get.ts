import { defineEventHandler, createError, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const user: any = requireAuth(event)
    const query = getQuery(event)

    const where: any = { usuarioId: Number(user.id) }
    if (query?.moduloId) {
      where.moduloId = Number(query.moduloId)
    }

    const sessions = await prisma.chatSession.findMany({
      where,
      orderBy: { creadoEn: 'desc' }
    })

    return { ok: true, sessions }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al listar sesiones'
    })
  }
})
