-- CreateTable
CREATE TABLE "NewsUpdates" (
    "news_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "NewsUpdates_pkey" PRIMARY KEY ("news_id")
);

-- AddForeignKey
ALTER TABLE "NewsUpdates" ADD CONSTRAINT "NewsUpdates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
