// server/api/debug/students.get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      select: {
        id: true,
        documentoIdentidad: true,
        nombre: true,
        correo: true,
        asignaturaId: true,
        usuarioId: true,
      },
    });

    return {
      status: 200,
      estudiantes: estudiantes,
      count: estudiantes.length
    };
  } catch (error) {
    console.error("Error obteniendo estudiantes:", error);
    return {
      status: 500,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});