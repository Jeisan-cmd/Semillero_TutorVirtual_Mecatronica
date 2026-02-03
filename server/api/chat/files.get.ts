import { defineEventHandler, createError, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const q = getQuery(event)
    const moduloId = q?.moduloId ? Number(q.moduloId) : undefined

    const where: any = { inChat: true }
    if (moduloId) where.moduloId = moduloId

    const materials = await prisma.material.findMany({ where })

    return { ok: true, materials }
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Error al listar archivos' })
  }
})