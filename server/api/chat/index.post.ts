import { defineEventHandler, readBody, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { generarRespuestaIA } from '~/server/services/chat/ai.service'
import { guardarContexto } from '~/server/services/chat/context.service'
import type { JwtPayload } from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const user = requireAuth(event) as JwtPayload
    const body = await readBody(event)

    console.log('POST /api/chat user:', user)
    console.log('POST /api/chat body:', body)

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
      usuarioId: Number((user as JwtPayload).id)
    })

    try {
      await guardarContexto({
        usuarioId: Number((user as JwtPayload).id),
        moduloId,
        mensajeUsuario: body.mensaje,
        mensajeIA: respuesta
      })
    } catch (e) {
      console.error('Error al guardar contexto:', e)
      // No interrumpimos la respuesta del chat por fallos de persistencia
    }

    return {
      ok: true,
      respuesta
    }
  } catch (error: any) {
    console.error('Error in POST /api/chat handler:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error en el chat'
    })
  }
})
