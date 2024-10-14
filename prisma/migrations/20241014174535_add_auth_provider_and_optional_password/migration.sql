/*
  Warnings:

  - Added the required column `auth_provider` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "auth_provider" TEXT NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
