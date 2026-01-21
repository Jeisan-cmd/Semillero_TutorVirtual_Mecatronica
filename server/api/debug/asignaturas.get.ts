// server/api/debug/asignaturas.get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const asignaturas = await prisma.asignatura.findMany({
      select: {
        id: true,
        nombre: true,
        idDocente: true,
        enlaceRegistro: true,
        fechaExpiracion: true,
        activo: true,
      },
    });

    return {
      status: 200,
      asignaturas: asignaturas,
      count: asignaturas.length
    };
  } catch (error) {
    console.error("Error obteniendo asignaturas:", error);
    return {
      status: 500,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});