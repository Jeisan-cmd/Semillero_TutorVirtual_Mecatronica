// server/api/debug/create-test-student.post.ts
import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, nombre, documentoIdentidad, carrera } = body;

    // Verificar si ya existe un estudiante con ese email
    const existingStudent = await prisma.estudiante.findUnique({
      where: { correo: email }
    });

    if (existingStudent) {
      return {
        status: 400,
        message: "Ya existe un estudiante con ese correo"
      };
    }

    // Crear asignatura de prueba si no existe
    let asignatura = await prisma.asignatura.findFirst();
    if (!asignatura) {
      asignatura = await prisma.asignatura.create({
        data: {
          nombre: "Asignatura de Prueba",
          carrera: "Ingeniería",
          jornada: "Diurna",
          idDocente: 2, // ID del docente existente
          activo: true,
        }
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear estudiante
    const estudiante = await prisma.estudiante.create({
      data: {
        documentoIdentidad,
        nombre,
        carrera,
        correo: email,
        contrasena: hashedPassword,
        asignaturaId: asignatura.id,
        usuarioId: asignatura.idDocente,
      }
    });

    return {
      status: 200,
      message: "Estudiante creado exitosamente",
      estudiante: {
        id: estudiante.id,
        nombre: estudiante.nombre,
        correo: estudiante.correo,
        asignatura: asignatura.nombre
      }
    };
  } catch (error) {
    console.error("Error creando estudiante de prueba:", error);
    return {
      status: 500,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});