import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    console.log("=== LOGIN TEST PARA:", email, "===");

    // Check in Usuario table
    console.log("Buscando en tabla Usuario...");
    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
      select: {
        id: true,
        contrasena: true,
        rol: true,
        nombre: true,
      },
    });

    if (usuario) {
      console.log("Usuario encontrado en tabla Usuario:", usuario.nombre, "Rol:", usuario.rol);
      const isPasswordValid = await bcrypt.compare(password, usuario.contrasena);
      console.log("Contraseña válida para usuario:", isPasswordValid);

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: usuario.id, role: usuario.rol },
          process.env.JWT_SECRET || "fallback_secret",
          { expiresIn: "1h" }
        );
        return {
          success: true,
          type: "usuario",
          user: usuario.nombre,
          role: usuario.rol,
          token: token.substring(0, 20) + "..."
        };
      } else {
        return { success: false, message: "Contraseña inválida para usuario" };
      }
    }

    // Check in Estudiante table
    console.log("Buscando en tabla Estudiante...");
    const estudiante = await prisma.estudiante.findUnique({
      where: { correo: email },
      select: {
        id: true,
        contrasena: true,
        nombre: true,
        asignaturaId: true,
      },
    });

    if (estudiante) {
      console.log("Estudiante encontrado:", estudiante.nombre);
      const isPasswordValid = await bcrypt.compare(password, estudiante.contrasena);
      console.log("Contraseña válida para estudiante:", isPasswordValid);

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: estudiante.id, role: "ESTUDIANTE", asignaturaId: estudiante.asignaturaId },
          process.env.JWT_SECRET || "fallback_secret",
          { expiresIn: "1h" }
        );
        return {
          success: true,
          type: "estudiante",
          user: estudiante.nombre,
          role: "ESTUDIANTE",
          asignaturaId: estudiante.asignaturaId,
          token: token.substring(0, 20) + "..."
        };
      } else {
        return { success: false, message: "Contraseña inválida para estudiante" };
      }
    }

    return { success: false, message: "Usuario no encontrado" };

  } catch (error) {
    console.error("Error en login test:", error);
    return {
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});