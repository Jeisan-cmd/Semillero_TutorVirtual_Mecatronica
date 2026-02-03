import { prisma } from '../server/utils/prisma'

;(async () => {
  try {
    const m = await prisma.material.create({
      data: {
        nombre: 'Test PDF',
        tipo: 'application/pdf',
        url: '/uploads/test.pdf',
        texto: 'Este es el contenido extraído del PDF. Contiene secciones importantes sobre física y álgebra.',
        inChat: true,
        moduloId: 1,
        creadoPorId: 2
      }
    })
    console.log('material creado:', m)
  } catch (e) {
    console.error('ERROR:', e)
  } finally {
    await prisma.$disconnect()
  }
})()
