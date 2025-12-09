// Handler principal reubicado. No se cambió la lógica, solo se separaron módulos.
import { defineEventHandler, readBody } from 'h3' // Si tu entorno ya provee estas funciones, ok.
import { prisma } from './prisma'
import { genAI, maxOutputTokens, generateTopicContent, generateAdditionalExamples, generateQuiz } from './ai'
import { verifyToken } from './auth'
import { rateLimiter} from './rateLimiter'
import { chatStorage } from './storage'
import { buscarVideoYouTube } from './youtube'
import { procesarContenidoTema } from './parser'
import type { QuizData } from './types'

export default defineEventHandler(async (event) => {
  try {
    // Verificación de token (se delega a auth.ts)
    const token = event.req.headers.authorization?.split(' ')[1]
    if (!token) {
      return { status: 401, message: 'No autorizado' }
    }

    const decoded = await verifyToken(token) as any
    if (!decoded) {
      return { status: 401, message: 'Token inválido' }
    }

    const userId = decoded.userId

    // Obtener estudiante desde Prisma
    const estudiante = await prisma.estudiante.findUnique({ where: { id: userId } })
    if (!estudiante) {
      return { status: 404, message: 'Estudiante no encontrado' }
    }

    // Leer cuerpo y mensaje del usuario
    const body = await readBody(event)
    const userMessage = body.message

    // Inicializar almacenamiento en memoria para el usuario si no existe
    if (!chatStorage.messages.has(userId)) chatStorage.messages.set(userId, [])
    if (!chatStorage.topicsProgress.has(userId)) chatStorage.topicsProgress.set(userId, new Map())
    if (!chatStorage.studyDocuments.has(userId)) {
      // Documentos de ejemplo en memoria (puedes cambiar a BD)
      chatStorage.studyDocuments.set(userId, [
        { id: 1, title: 'algebra_lineal.pdf', topics: ['Transformaciones lineales','Espacios vectoriales','Matrices'], type: 'pdf', url: '/documents/algebra_lineal.pdf' },
        { id: 2, title: 'calculo_diferencial.pdf', topics: ['Límites','Derivadas','Integrales'], type: 'pdf', url: '/documents/calculo_diferencial.pdf' }
      ])
    }

    // Historial y formato requerido por el modelo
    const chatHistory = chatStorage.messages.get(userId) || []
    let formattedHistory = chatHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.content }] }))

    // Asegurar que el primer mensaje sea del usuario
    if (formattedHistory.length === 0 || formattedHistory[0].role !== 'user') {
      formattedHistory = [{ role: 'user', parts: [{ text: 'Hola, soy un estudiante que necesita ayuda.' }] }, ...formattedHistory]
    }

    // Mensaje de inicio: devolver documentos y progreso
    if (userMessage === 'inicio') {
      const documents = chatStorage.studyDocuments.get(userId) || []
      const topicsProgressMap = chatStorage.topicsProgress.get(userId) || new Map()
      const topicsProgressArray = Array.from(topicsProgressMap.entries()).map(([topic, prog]) => ({ topic, progress: prog.progress, completed: prog.completed }))
      return { status: 200, data: { documents, topicsProgress: topicsProgressArray } }
    }

    // Solicitud para estudiar un tema (prefijo STUDY_TOPIC:)
    if (typeof userMessage === 'string' && userMessage.startsWith('STUDY_TOPIC:')) {
      const topic = userMessage.replace('STUDY_TOPIC:', '').trim()
      const topicContentText = await generateTopicContent(genAI, topic)
      const parsed = procesarContenidoTema(topicContentText)

      // Guardar estado de tema actual y progreso inicial si no existe
      chatStorage.currentTopics.set(userId, topic)
      const topicsMap = chatStorage.topicsProgress.get(userId)!
      if (!topicsMap.has(topic)) topicsMap.set(topic, { progress: 0, completed: false })

      return { status: 200, data: parsed }
    }

    // Solicitar más ejemplos
    if ((typeof userMessage === 'string' && (userMessage.toLowerCase().includes('más ejemplos') || userMessage.toLowerCase().includes('otro ejemplo'))) || body.requestType === 'examples') {
      const currentTopic = chatStorage.currentTopics.get(userId)
      if (!currentTopic) return { status: 400, message: 'No hay tema activo para generar ejemplos' }
      const examplesText = await generateAdditionalExamples(genAI, currentTopic)
      return { status: 200, data: examplesText }
    }

    // Responder a un quiz (A-D)
    if (typeof userMessage === 'string' && /^[A-D]$/.test(userMessage)) {
      const quizKey = `quiz_user_${userId}`
      const quiz = chatStorage.quizzes.get(quizKey)
      if (!quiz) return { status: 400, message: 'No hay quiz activo' }

      const correct = userMessage === quiz.correctAnswer
      const currentTopic = chatStorage.currentTopics.get(userId)
      if (currentTopic) {
        const topics = chatStorage.topicsProgress.get(userId)!
        const prog = topics.get(currentTopic) || { progress: 0, completed: false }
        prog.progress = Math.min(100, prog.progress + (correct ? 20 : 5))
        prog.completed = prog.progress >= 100
        topics.set(currentTopic, prog)
      }

      return { status: 200, correct, explanation: quiz.explanation }
    }

    // Buscar video en YouTube
    if ((typeof userMessage === 'string' && (userMessage.toLowerCase().includes('video') || userMessage.toLowerCase().includes('multimedia') || userMessage.toLowerCase().includes('ver'))) || body.requestType === 'video') {
      const currentTopic = chatStorage.currentTopics.get(userId) || body.topic || userMessage
      try {
        const video = await buscarVideoYouTube(currentTopic as string)
        return { status: 200, data: video }
      } catch (err) {
        return { status: 500, message: 'Error buscando video' }
      }
    }

    // Generar quiz
    if ((typeof userMessage === 'string' && (userMessage.toLowerCase().includes('quiz') || userMessage.toLowerCase().includes('pregunta') || userMessage.toLowerCase().includes('evalua') || userMessage.toLowerCase().includes('test'))) || body.requestType === 'quiz') {
      const currentTopic = chatStorage.currentTopics.get(userId) || body.topic || userMessage
      const quiz = await generateQuiz(genAI, currentTopic as string)
      const quizKey = `quiz_user_${userId}`
      chatStorage.quizzes.set(quizKey, { ...quiz, timestamp: new Date() } as any as QuizData)
      return { status: 200, data: quiz }
    }

    // Para cualquier otro mensaje: usar el modelo Gemini/AI
    try {
      // Control de tasa por usuario
      if (!rateLimiter.canMakeRequest(userId)) {
        const wait = rateLimiter.getTimeUntilNextRequest(userId)
        return { status: 429, message: `Límite alcanzado. Intenta de nuevo en ${Math.ceil(wait/1000)}s` }
      }

      // Preparar chat para el modelo y enviar mensaje
      const chat = (genAI as any).startChat({ history: formattedHistory, generationConfig: { maxOutputTokens } })
      const result = await chat.sendMessage(userMessage)
      const response = await result.response
      const text = response.text()

      // Guardar intercambio en historial en memoria
      const userMsgs = chatStorage.messages.get(userId)!
      userMsgs.push({ role: 'user', content: userMessage, timestamp: new Date() })
      userMsgs.push({ role: 'assistant', content: text, timestamp: new Date() })
      chatStorage.messages.set(userId, userMsgs)

      return { status: 200, data: text }
    } catch (error: any) {
      console.error('Error usando AI:', error)
      return { status: 500, message: 'Error generando respuesta' }
    }

  } catch (error: any) {
    console.error('Error en chat.post.ts:', error)
    return { status: 500, message: 'Error interno del servidor', error: error.message }
  }
})