interface IAInput {
  mensaje: string
  moduloId: number
  usuarioId: number
}

export async function generarRespuestaIA(data: IAInput) {
  // TEMPORAL (mock)
  return `Respuesta IA para el módulo ${data.moduloId}: "${data.mensaje}"`
}
