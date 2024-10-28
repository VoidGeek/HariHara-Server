/*
  Warnings:

  - Added the required column `description_kannada` to the `Sevas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_kannada` to the `Sevas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sevas" ADD COLUMN     "description_kannada" TEXT NOT NULL,
ADD COLUMN     "name_kannada" TEXT NOT NULL;
