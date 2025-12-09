// Inicialización de Prisma en un módulo separado para reutilizar la instancia.
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()