// Verifica y decodifica JWT. Mantén la clave en ENV: JWT_SECRET
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'; // Importing types for request and response

export async function verifyToken(token: string) {
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    return decoded
  } catch (error) {
    return null
  }

}