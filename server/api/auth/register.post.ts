import { PrismaClient, Rol } from "@prisma/client"
import { readBody, createError } from "h3"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
<<<<<<< HEAD
  const body: RegisterBody = await readBody(event);
  const {
    email,
    password,
    role,
    documentoIdentidad,
    nombre,
    telefono = "",
  } = body;

  // Validación de entrada
  if (!email || !password || !role || !documentoIdentidad || !nombre) {
    return createError({
      statusCode: 400,
      message: "Todos los campos son obligatorios excepto el teléfono.",
    });
  }

  // Rechazar intentos de registro con rol "ESTUDIANTE" - deben usar la página de inscripción
  if (role === "ESTUDIANTE") {
    return createError({
      statusCode: 400,
      message: "Los estudiantes deben registrarse usando un enlace de invitación de su docente. Ve a la página de inicio y solicita acceso a tu docente.",
    });
  }

=======
>>>>>>> origin/Rama_Esteban
  try {
    const body = await readBody(event)

    const {
      documentoIdentidad,
      nombre,
      correo,
      contrasena,
      rol,
    } = body

    // 🔒 Validaciones mínimas
    if (!documentoIdentidad || !nombre || !correo || !contrasena) {
      throw createError({
        statusCode: 400,
        statusMessage: "Datos incompletos",
      })
    }

    // 🔁 Verificar correo único
    const existe = await prisma.usuario.findUnique({
      where: { correo },
    })

    if (existe) {
      throw createError({
        statusCode: 409,
        statusMessage: "El usuario ya existe",
      })
    }

    const hash = await bcrypt.hash(contrasena, 10)

    const usuario = await prisma.usuario.create({
      data: {
        documentoIdentidad,
        nombre,
        correo,
        contrasena: hash,
        rol: rol ?? Rol.ESTUDIANTE, // 👈 DEFAULT SEGURO
      },
    })

    return {
      ok: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    }
  } catch (error) {
    console.error("❌ ERROR REGISTER:", error)

    throw createError({
      statusCode: 500,
      statusMessage: "Error al registrar",
    })
  }
})
