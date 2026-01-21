import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import { Prisma } from '@prisma/client'

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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Correo o documento ya registrado'
        })
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})



