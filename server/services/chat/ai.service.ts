import { prisma } from '~/server/utils/prisma'

interface IAInput {
  mensaje: string
  moduloId: number
  usuarioId: number
}

export async function generarRespuestaIA(data: IAInput) {
  // 1) Obtener materiales asociados al módulo (si los hay) y su texto para contexto
  try {
    const materials = await prisma.material.findMany({ where: { moduloId: data.moduloId, inChat: true } })
    const context = materials.map(m => m.texto).filter(Boolean).join('\n\n')

    // TEMPORAL: simple mock que incluye el contexto extraído
    let respuesta = `Respuesta IA para el módulo ${data.moduloId}: "${data.mensaje}"`
    if (context && context.length > 0) {
      respuesta += `\n\n[Contexto extraído de archivos:]\n${context.slice(0, 2000)}...` // truncar a 2000 chars
    }

    return respuesta
  } catch (e) {
    console.error('Error generando respuesta IA con contexto:', e)
    return `Respuesta IA para el módulo ${data.moduloId}: "${data.mensaje}"`
  }
}
