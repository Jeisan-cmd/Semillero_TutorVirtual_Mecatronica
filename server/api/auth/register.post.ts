import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    correo,
    contrasena,
    rol,
    documentoIdentidad,
    nombre,
    telefono
  } = body

  if (!correo || !contrasena || !rol || !documentoIdentidad || !nombre) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos'
    })
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10)

  try {
    const user = await prisma.usuario.create({
      data: {
        correo,
        contrasena: hashedPassword,
        rol,
        documentoIdentidad,
        nombre,
        telefono
      }
    })

    return { id: user.id }
  } catch (err) {
    throw createError({
      statusCode: 409,
      statusMessage: 'El usuario ya existe'
    })
  }
})
