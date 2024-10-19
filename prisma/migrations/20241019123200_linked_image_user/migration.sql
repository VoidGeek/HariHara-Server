/*
  Warnings:

  - You are about to drop the column `supabase_url` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageAssociations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_at` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageAssociations" DROP CONSTRAINT "ImageAssociations_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "ImageAssociations" DROP CONSTRAINT "ImageAssociations_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_profile_image_id_fkey";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "supabase_url",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "modified_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "modified_by" INTEGER;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "profile_image_id";

-- DropTable
DROP TABLE "Gallery";

-- DropTable
DROP TABLE "ImageAssociations";

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
