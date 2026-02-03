import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const form = formidable({ multiples: false });
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Validar archivo
    if (!files.file) {
      throw createError({
        statusCode: 400,
        message: "No se recibió ningún archivo.",
      });
    }

    // Obtener idAsignatura
    const idAsignatura = parseInt(
      (Array.isArray(fields.idAsignatura)
        ? fields.idAsignatura[0]
        : fields.idAsignatura) || "0" // Default to "0" if undefined
    );
    if (isNaN(idAsignatura)) {
      throw createError({
        statusCode: 400,
        message: "El ID de la asignatura no es válido.",
      });
    }

    // Verificar si la asignatura existe
    const asignatura = await prisma.subject.findUnique({
      where: { id: idAsignatura },
    });
    if (!asignatura) {
      throw createError({
        statusCode: 404,
        message: "La asignatura no existe.",
      });
    }

    // Subir archivo localmente
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      throw createError({
        statusCode: 400,
        message: "El archivo no es válido.",
      });
    }
    const fileData = await fs.readFile(file.filepath);
    const uniqueFilename = `${Date.now()}-${file.originalFilename}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);
    await fs.writeFile(uploadPath, fileData);
    const publicUrl = `/uploads/${uniqueFilename}`;

    // Guardar en la tabla Material (creamos el registro primero)
    const material = await prisma.material.create({
      data: {
        name: file.originalFilename || "Archivo",
        mimeType: file.mimetype || "application/octet-stream",
        url: publicUrl,
        subjectId: idAsignatura,
        moduleId: fields.moduloId ? Number(fields.moduloId) : undefined
      },
    });

    // Intentar extraer texto (PDF/DOCX/XLSX) en background y guardar en el registro
    try {
      const os = await import('os')
      const tmpDir = os.tmpdir()
      const tempPath = path.join(tmpDir, `tmp-${Date.now()}-${file.originalFilename}`)
      await fs.writeFile(tempPath, fileData)

      const { convertFile } = await import('~/server/utils/fileConverter')
      const extracted = await convertFile(tempPath, file.originalFilename || '')

      let texto = ''
      if (extracted) {
        if (typeof extracted === 'object' && 'content' in extracted && typeof extracted.content === 'string') {
          texto = extracted.content
        } else if (typeof extracted === 'object' && 'pages' in extracted && Array.isArray(extracted.pages)) {
          texto = extracted.pages.map((p:any) => p.content).join('\n')
        } else {
          texto = JSON.stringify(extracted)
        }
      }

      if (texto && texto.length > 0) {
        await prisma.material.update({ where: { id: material.id }, data: { content: texto, inChat: true } })
      }
    } catch (err) {
      console.error('Error extrayendo texto del archivo:', err)
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor.",
    });
  }
});
