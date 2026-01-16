import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Ejecutando seed...')

  // Datos del superadmin
  const superAdminEmail = 'superadmin@tutor-mecatronica.com'
  const superAdminPassword = 'SuperAdmin123*'

  // Verificar si ya existe
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail }
  })

  if (existingSuperAdmin) {
    console.log('⚠️ Superadmin ya existe, no se crea de nuevo')
    return
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10)

  // Crear superadmin
  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      password: hashedPassword,
      role: 'SUPERADMIN'
    }
  })

  console.log('✅ Superadmin creado con éxito:')
  console.log({
    id: superAdmin.id,
    email: superAdmin.email,
    role: superAdmin.role
  })
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
