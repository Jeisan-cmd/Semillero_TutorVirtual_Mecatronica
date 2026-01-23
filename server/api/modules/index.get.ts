import { defineEventHandler } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  return await prisma.modulo.findMany({
    orderBy: { orden: 'asc' },
    select: {
      id: true,
      titulo: true,
      contenido: true,
      orden: true,
      creadoEn: true
    }
  })
})
