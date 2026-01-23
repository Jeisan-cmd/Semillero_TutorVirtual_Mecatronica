import { prisma } from '~/server/utils/prisma'
import { hashPassword, comparePassword } from '~/server/utils/password'
import { generateToken } from '~/server/utils/jwt'
import { createError } from 'h3'

function sanitizeUser(user: any) {
  return {
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
    activo: user.activo
  }
}

export async function registerUser(data: any) {
  const exists = await prisma.usuario.findFirst({
    where: {
      OR: [
        { correo: data.correo },
        { documentoIdentidad: data.documentoIdentidad }
      ]
    }
  })

  if (exists) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Usuario ya existe'
    })
  }

  const user = await prisma.usuario.create({
    data: {
      documentoIdentidad: data.documentoIdentidad,
      nombre: data.nombre,
      correo: data.correo,
      contrasena: await hashPassword(data.contrasena),
      rol: data.rol
    }
  })

  const token = generateToken({
    id: user.id,
    rol: user.rol
  })

  return {
    user: sanitizeUser(user),
    token
  }
}

export async function loginUser(correo: string, contrasena: string) {
  const user = await prisma.usuario.findUnique({
    where: { correo }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales inválidas'
    })
  }

  if (!user.activo) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Usuario inactivo'
    })
  }

  const valid = await comparePassword(contrasena, user.contrasena)

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales inválidas'
    })
  }

  await prisma.usuario.update({
    where: { id: user.id },
    data: { lastLoginDate: new Date() }
  })

  const token = generateToken({
    id: user.id,
    rol: user.rol
  })

  return {
    user: sanitizeUser(user),
    token
  }
}
