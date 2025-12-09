// Tipos e interfaces usados por los módulos
export interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  timestamp: Date;
}

export interface Ejemplo {
  id: number;
  titulo: string;
  problema: string;
  solucion: string;
  conclusion: string;
}