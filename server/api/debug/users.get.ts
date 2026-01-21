// server/api/debug/users.get.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        documentoIdentidad: true,
        nombre: true,
        rol: true,
        correo: true,
      },
    });

    return {
      status: 200,
      usuarios: usuarios,
      count: usuarios.length
    };
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return {
      status: 500,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});