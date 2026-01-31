import { defineEventHandler, readBody, createError } from 'h3'
import { requireAuth } from '~/server/guards/auth'
import { generarRespuestaIA } from '~/server/services/chat/ai.service'
import { guardarContexto } from '~/server/services/chat/context.service'

export default defineEventHandler(async (event) => {
  try {
    const user = requireAuth(event)
    const body = await readBody(event)

    if (!body?.mensaje || !body?.moduloId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mensaje y módulo requeridos'
      })
    }

    const moduloId = Number(body.moduloId)

    const respuesta = await generarRespuestaIA({
      mensaje: body.mensaje,
      moduloId,
      usuarioId: Number(user.id)
    })

    await guardarContexto({
      usuarioId: Number(user.id),
      moduloId,
      mensajeUsuario: body.mensaje,
      mensajeIA: respuesta
    })

    return {
      ok: true,
      respuesta
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error en el chat'
    })
  }
})
