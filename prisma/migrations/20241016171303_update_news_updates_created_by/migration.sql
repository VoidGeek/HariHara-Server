-- DropForeignKey
ALTER TABLE "NewsUpdates" DROP CONSTRAINT "NewsUpdates_created_by_fkey";

-- AlterTable
ALTER TABLE "NewsUpdates" ALTER COLUMN "created_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NewsUpdates" ADD CONSTRAINT "NewsUpdates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
