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
import jwt from 'jsonwebtoken'
import { Rol } from '@prisma/client'

export interface AuthTokenPayload {
  id: number
  rol: Rol
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET no está definido')
  }
  return secret
}

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '7d'
  })
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload
}

