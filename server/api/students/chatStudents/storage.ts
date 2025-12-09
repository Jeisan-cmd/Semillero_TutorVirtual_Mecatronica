// Almacenamiento en memoria para mensajes, temas y quizzes.
// En producción reemplazar por una base de datos persistente.
import type { QuizData } from './types'

export const chatStorage: {
  messages: Map<number, Array<{role: string, content: string, timestamp: Date}>>,
  currentTopics: Map<number, string>,
  topicsProgress: Map<number, Map<string, {progress: number, completed: boolean}>>,
  studyDocuments: Map<number, Array<{id: number, title: string, topics: string[], type: string, url: string}>>,
  quizzes: Map<string, QuizData>
} = {
  messages: new Map(),
  currentTopics: new Map(),
  topicsProgress: new Map(),
  studyDocuments: new Map(),
  quizzes: new Map()
}