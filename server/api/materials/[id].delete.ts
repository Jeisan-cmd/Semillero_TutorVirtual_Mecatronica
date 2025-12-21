import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;

  if (!idParam) {
    throw createError({
      statusCode: 400,
      message: "Material ID is required.",
    });
  }
  const idMaterial = parseInt(idParam);
  if (isNaN(idMaterial)) {
    throw createError({
      statusCode: 400,
      message: "El ID del material no es válido.",
    });
  }

  try {
    // Obtener el material de la base de datos
    const material = await prisma.material.findUnique({
      where: { id: idMaterial },
    });

    if (!material) {
      throw createError({
        statusCode: 404,
        message: "El material no existe.",
      });
    }

    // Eliminar el archivo local
    if (material.url.startsWith("/uploads/")) {
      const filename = material.url.split("/").pop();
      const filePath = path.join(process.cwd(), "public", "uploads", filename!);
      try {
        await fs.unlink(filePath);
      } catch (fileErr) {
        console.warn("Error al eliminar el archivo local:", fileErr);
        // No throw error, continue to delete from DB
      }
    }

    // Eliminar el material de la base de datos
    await prisma.material.delete({
      where: { id: idMaterial },
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor.",
    });
  }
});
