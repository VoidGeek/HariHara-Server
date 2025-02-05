-- CreateTable
CREATE TABLE "Gallery" (
    "gallery_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("gallery_id")
);

-- CreateTable
CREATE TABLE "NewsImages" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "NewsImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Images"("image_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsImages" ADD CONSTRAINT "NewsImages_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "NewsUpdates"("news_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsImages" ADD CONSTRAINT "NewsImages_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Images"("image_id") ON DELETE RESTRICT ON UPDATE CASCADE;
