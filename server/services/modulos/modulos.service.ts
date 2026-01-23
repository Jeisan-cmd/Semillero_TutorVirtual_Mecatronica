import { prisma } from '~/server/utils/prisma'

interface CrearModuloDTO {
  titulo: string
  contenido: string
  orden: number
  creadoPorId: number
}

export async function crearModulo(data: CrearModuloDTO) {
  return await prisma.modulo.create({
    data: {
      titulo: data.titulo,
      contenido: data.contenido,
      orden: data.orden,
      creadoPorId: data.creadoPorId
    }
  })
}
