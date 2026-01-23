import { readBody, createError } from 'h3'
import { crearModulo } from '~/server/services/modulos/modulos.service'
import requireRole from '~/server/guards/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'SUPERADMIN'])

  const body = await readBody(event)
  const user = event.context.user

  const { titulo, contenido, orden } = body

  if (!titulo || !contenido || orden === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos'
    })
  }

  const modulo = await crearModulo({
    titulo,
    contenido,
    orden,
    creadoPorId: user.id
  })

  return {
    ok: true,
    modulo
  }
})
