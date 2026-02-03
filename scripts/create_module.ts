import { prisma } from '../server/utils/prisma'

;(async () => {
  try {
    const m = await prisma.modulo.create({
      data: {
        titulo: 'Módulo prueba',
        contenido: 'Contenido de prueba',
        orden: 1,
        creadoPorId: 2
      }
    })
    console.log('Módulo creado:', m)
  } catch (e) {
    console.error('ERROR al crear módulo:', e)
  } finally {
    await prisma.$disconnect()
  }
})()
