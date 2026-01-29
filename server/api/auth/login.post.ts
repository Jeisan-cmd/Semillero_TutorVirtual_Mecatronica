<<<<<<< HEAD
// server/api/auth/login.post.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    console.log("=== LOGIN PARA:", email, "===");

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
          token,
          role: usuario.rol,
          userId: usuario.id
        };
      } else {
        return createError({
          statusCode: 401,
          message: "Invalid credentials",
        });
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
          token,
          role: "ESTUDIANTE",
          asignaturaId: estudiante.asignaturaId,
          userId: estudiante.id
        };
      } else {
        return createError({
          statusCode: 401,
          message: "Invalid credentials",
        });
      }
    }

    return createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error("Login error:", error);
    return createError({
      statusCode: 500,
      message: "Internal server error",
    });
=======
import { loginUser } from '~/server/services/auth/auth.service'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.correo || !body?.contrasena) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos'
    })
>>>>>>> origin/Rama_Esteban
  }

  return await loginUser(body.correo, body.contrasena)
})
