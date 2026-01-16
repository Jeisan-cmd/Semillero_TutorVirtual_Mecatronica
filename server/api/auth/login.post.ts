// server/api/auth/login.post.ts
/*import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { defineEventHandler, readBody, createError } from "h3";

const prisma = new PrismaClient();

interface LoginRequest {
  email: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const body: LoginRequest = await readBody(event);
  const { email, password } = body;

  try {
    // Check in Usuario table
    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
      select: {
        id: true,
        contrasena: true,
        rol: true,
      },
    });

    if (usuario) {
      const isPasswordValid = await bcrypt.compare(
        password,
        usuario.contrasena
      );
      if (!isPasswordValid) {
        return createError({
          statusCode: 401,
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign(
        { userId: usuario.id, role: usuario.rol },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1h" }
      );
      return { token, role: usuario.rol, userId: usuario.id }; // Devuelve el userId
    }

    // Check in Estudiante table
    const estudiante = await prisma.estudiante.findUnique({
      where: { correo: email },
      select: {
        id: true,
        contrasena: true,
        asignaturaId: true,
      },
    });

    if (estudiante) {
      const isPasswordValid = await bcrypt.compare(
        password,
        estudiante.contrasena
      );
      if (!isPasswordValid) {
        return createError({
          statusCode: 401,
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign(
        { userId: estudiante.id, role: "ESTUDIANTE", asignaturaId: estudiante.asignaturaId },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1h" }
      );
      return { token, role: "ESTUDIANTE", asignaturaId: estudiante.asignaturaId, userId: estudiante.id }; // Devuelve el userId
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
  }
});*/


import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signToken } from '../../utils/jwt'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{
    email: string
    password: string
  }>(event)

  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const token = signToken({
    id: user.id,
    role: user.role
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  }
})
