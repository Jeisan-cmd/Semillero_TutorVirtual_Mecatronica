import { PrismaClient, Rol } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Ejecutando seed...')

  const correoAdmin = 'superadmin@tutorvirtual.com'

  const existente = await prisma.usuario.findUnique({
    where: { correo: correoAdmin },
  })

  if (existente) {
    console.log('⚠️ SUPERADMIN ya existe, seed omitido')
    return
  }

  const hash = await bcrypt.hash('SuperAdmin123*', 10)

  await prisma.usuario.create({
    data: {
      documentoIdentidad: '0000000000',
      nombre: 'Super Admin',
      correo: correoAdmin,
      contrasena: hash,
      rol: Rol.SUPERADMIN
    },
  })

  console.log('✅ SUPERADMIN creado correctamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
