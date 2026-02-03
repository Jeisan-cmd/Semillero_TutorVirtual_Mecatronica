import { guardarContexto } from '../server/services/chat/context.service'

;(async () => {
  try {
    const r = await guardarContexto({ usuarioId: 2, moduloId: 1, mensajeUsuario: 'prueba desde script', mensajeIA: 'respuesta IA' })
    console.log('guardado:', r)
  } catch (e) {
    console.error('ERROR guardarContexto:', e)
  }
})()
