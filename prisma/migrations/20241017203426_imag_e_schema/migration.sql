/*
  Warnings:

  - You are about to drop the column `supabase_url` on the `Images` table. All the data in the column will be lost.
  - Added the required column `file_path` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "supabase_url",
ADD COLUMN     "file_path" TEXT NOT NULL;
