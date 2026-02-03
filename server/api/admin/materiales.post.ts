import { crearMaterial } from '~/server/services/material/material.service'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.nombre || !body.tipo || !body.url || !body.creadoPorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos obligatorios faltantes'
      })
    }

    const material = await crearMaterial({
      nombre: body.nombre,
      tipo: body.tipo,
      url: body.url,
      descripcion: body.descripcion,
      texto: body.texto,
      inChat: body.inChat,
      idAsignatura: body.idAsignatura,
      moduloId: body.moduloId,
      creadoPorId: body.creadoPorId // 👈 CLAVE
    })

    return {
      ok: true,
      data: material
    }
  } catch (error) {
    console.error(error)
    throw error
  }
})
