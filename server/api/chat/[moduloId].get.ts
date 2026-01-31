import { defineEventHandler, createError, getRouterParam } from 'h3'
import { requireAuth } from '~/server/guards/auth'
import { obtenerContexto } from '~/server/services/chat/context.service'

export default defineEventHandler(async (event) => {
  try {
    const user = requireAuth(event)
    const moduloId = getRouterParam(event, 'moduloId')

    if (!moduloId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Módulo no especificado'
      })
    }

    const historial = await obtenerContexto(
      Number(user.id),
      Number(moduloId)
    )

    return { ok: true, historial }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al obtener historial'
    })
  }
})
