/*
  Warnings:

  - Added the required column `content_kannada` to the `NewsUpdates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_kannada` to the `NewsUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsUpdates" ADD COLUMN     "content_kannada" TEXT NOT NULL,
ADD COLUMN     "title_kannada" TEXT NOT NULL;
