// server/api/debug/test-password.post.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    const estudiante = await prisma.estudiante.findUnique({
      where: { correo: email },
      select: {
        id: true,
        contrasena: true,
        nombre: true,
      },
    });

    if (!estudiante) {
      return {
        status: 404,
        message: "Estudiante no encontrado"
      };
    }

    const isValid = await bcrypt.compare(password, estudiante.contrasena);

    return {
      status: 200,
      estudiante: estudiante.nombre,
      passwordValid: isValid,
      hashedPassword: estudiante.contrasena.substring(0, 20) + "..."
    };
  } catch (error) {
    console.error("Error probando contraseña:", error);
    return {
      status: 500,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});