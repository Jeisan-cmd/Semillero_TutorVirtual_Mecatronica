/*
  Warnings:

  - You are about to drop the `Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `asignaturaId` to the `Modulo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Estudiante" DROP CONSTRAINT "Estudiante_asignaturaId_fkey";

-- DropForeignKey
ALTER TABLE "Estudiante" DROP CONSTRAINT "Estudiante_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Modulo" ADD COLUMN     "asignaturaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "lastLoginDate" DROP NOT NULL,
ALTER COLUMN "lastLoginDate" DROP DEFAULT;

-- DropTable
DROP TABLE "Estudiante";

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "asignaturaId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_usuarioId_asignaturaId_key" ON "Inscripcion"("usuarioId", "asignaturaId");

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "Asignatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "Asignatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;
