import { prisma } from '../server/utils/prisma'

;(async () => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: 2 } })
    const modulo = await prisma.modulo.findUnique({ where: { id: 1 } })

    console.log('usuario:', usuario)
    console.log('modulo:', modulo)
  } catch (e) {
    console.error('ERROR:', e)
  } finally {
    await prisma.$disconnect()
  }
})()
