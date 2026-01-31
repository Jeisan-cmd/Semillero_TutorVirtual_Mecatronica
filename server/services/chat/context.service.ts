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
  console.log('Contexto guardado:', data)
}

export async function obtenerContexto(
  usuarioId: number,
  moduloId: number
) {
  return []
}
