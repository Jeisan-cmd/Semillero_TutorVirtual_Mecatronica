import { prisma } from '~/server/utils/prisma'

interface IAInput {
  mensaje: string
  moduloId: number
  usuarioId: number
}

export async function generarRespuestaIA(data: IAInput) {
  // TEMPORAL (mock)
  return `Respuesta IA para el módulo ${data.moduloId}: "${data.mensaje}"`
}

interface ContextoInput {
  usuarioId: number
  moduloId: number
  mensajeUsuario: string
  mensajeIA?: string
}

export async function guardarContexto(data: ContextoInput) {
  // buscar sesión existente
  const session = await prisma.chatSession.findFirst({
    where: { usuarioId: data.usuarioId, moduloId: data.moduloId }
  })

  const newEntries = [
    { origen: 'user', mensaje: data.mensajeUsuario, createdAt: new Date() },
    ...(data.mensajeIA ? [{ origen: 'ia', mensaje: data.mensajeIA, createdAt: new Date() }] : [])
  ]

  if (session) {
    const mensajesActuales = Array.isArray(session.mensajes) ? session.mensajes : []
    return prisma.chatSession.update({
      where: { id: session.id },
      data: { mensajes: [...mensajesActuales, ...newEntries] }
    })
  } else {
    return prisma.chatSession.create({
      data: {
        usuarioId: data.usuarioId,
        moduloId: data.moduloId,
        mensajes: newEntries
      }
    })
  }
}

export async function obtenerContexto(usuarioId: number, moduloId: number) {
  // Obtener la sesión y devolver los mensajes como historial
  const session = await prisma.chatSession.findFirst({
    where: { usuarioId, moduloId }
  })

  if (!session) return []

  // mensajes es un JSON[] con { origen, mensaje, createdAt }
  return session.mensajes || []
}
