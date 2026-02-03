import { prisma } from '~/server/utils/prisma'

interface CrearMaterialDTO {
  nombre: string
  tipo: string
  url: string
  creadoPorId: number
  descripcion?: string
  texto?: string
  inChat?: boolean
  idAsignatura?: number
  moduloId?: number
}

export async function crearMaterial(data: CrearMaterialDTO) {
  return prisma.material.create({
    data: {
      nombre: data.nombre,
      tipo: data.tipo,
      url: data.url,
      creadoPorId: data.creadoPorId,
      descripcion: data.descripcion,
      texto: data.texto,
      inChat: data.inChat,
      idAsignatura: data.idAsignatura,
      moduloId: data.moduloId
    }
  })
}
