-- CreateTable
CREATE TABLE "SevaForm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nakshathra" TEXT NOT NULL,
    "rashi" TEXT NOT NULL,
    "gotra" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "mobileNumberConfirmation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sevaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SevaForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SevaForm" ADD CONSTRAINT "SevaForm_sevaId_fkey" FOREIGN KEY ("sevaId") REFERENCES "Sevas"("seva_id") ON DELETE RESTRICT ON UPDATE CASCADE;
