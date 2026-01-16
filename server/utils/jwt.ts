// server/utils/jwt.ts
/*import jwt from 'jsonwebtoken'

interface DecodedToken {
  userId: number
  role: string
  iat: number
  exp: number
}

export const verifyToken = (token: string): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: Error | null, decoded: unknown) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded as DecodedToken)
      }
    })
  })
}*/

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { Role } from '@prisma/client'

/**
 * Payload que nosotros guardamos en el JWT
 * (controlado, no genérico)
 */
export interface AuthTokenPayload extends JwtPayload {
  id: string
  role: Role
}

/**
 * Variables de entorno
 */
const JWT_SECRET: string = process.env.JWT_SECRET ?? 'dev_secret'
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = '7d'

/**
 * Firma un token JWT
 */
export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}
