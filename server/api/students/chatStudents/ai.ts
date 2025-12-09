// Cliente de AI y funciones de generación (Gemini). Ajusta la importación según tu SDK.
import { GoogleGenerativeAI } from '@google/generative-ai' // Verifica paquete/versión en tu proyecto
import type { QuizData } from './types'

export const genAI = new (GoogleGenerativeAI as any)(process.env.GEMINI_API_KEY || '')
export const modelName = 'gemini-1.5-pro'
export const maxOutputTokens = 8192

// Generar contenido estructurado para un tema
export const generateTopicContent = async (model: any, topic: string) => {
  const prompt = `
    Actúa como un tutor experto en ${topic}.
    Proporciona una explicación con el formato solicitado.
  `
  const chat = model.startChat({
    history: [{ role: 'user', parts: [{ text: `Quiero aprender sobre ${topic}` }] }],
    generationConfig: { maxOutputTokens: maxOutputTokens }
  })
  const result = await chat.sendMessage(prompt)
  const response = await result.response
  return response.text()
}

// Generar ejemplos adicionales
export const generateAdditionalExamples = async (model: any, topic: string) => {
  const prompt = `Genera dos ejemplos detallados sobre ${topic}.`
  const chat = model.startChat({
    history: [{ role: 'user', parts: [{ text: `Necesito ejemplos prácticos sobre ${topic}` }] }],
    generationConfig: { maxOutputTokens: maxOutputTokens }
  })
  const result = await chat.sendMessage(prompt)
  const response = await result.response
  return response.text()
}

// Generar quiz y parsear opciones/respuesta
export const generateQuiz = async (model: any, topic: string): Promise<QuizData> => {
  const prompt = `Genera una pregunta de evaluación sobre ${topic}.`
  const chat = model.startChat({
    history: [{ role: 'user', parts: [{ text: `Necesito una pregunta de quiz sobre ${topic}` }] }],
    generationConfig: { maxOutputTokens: maxOutputTokens }
  })
  const result = await chat.sendMessage(prompt)
  const response = await result.response
  const responseText = response.text()

  // Extracción con regex (siguiendo tu formato original)
  const questionMatch = responseText.match(/PREGUNTA\n([\s\S]*?)\n\nOPCIONES/)
  const optionsMatch = responseText.match(/OPCIONES\n([\s\S]*?)\n\nRESPUESTA_CORRECTA/)
  const answerMatch = responseText.match(/RESPUESTA_CORRECTA\n([A-D])/)
  const explanationMatch = responseText.match(/EXPLICACION\n([\s\S]*?)$/)

  let options: string[] = []
  if (optionsMatch && optionsMatch[1]) {
    const optionsText = optionsMatch[1].trim()
    options = [
      optionsText.match(/A\)(.*?)(?=\nB\)|$)/s)?.[1]?.trim() || '',
      optionsText.match(/B\)(.*?)(?=\nC\)|$)/s)?.[1]?.trim() || '',
      optionsText.match(/C\)(.*?)(?=\nD\)|$)/s)?.[1]?.trim() || '',
      optionsText.match(/D\)(.*?)(?=\n|$)/s)?.[1]?.trim() || ''
    ]
  }

  return {
    question: questionMatch ? questionMatch[1].trim() : '',
    options,
    correctAnswer: answerMatch ? answerMatch[1] : '',
    explanation: explanationMatch ? explanationMatch[1].trim() : '',
    timestamp: new Date()
  } as QuizData
}