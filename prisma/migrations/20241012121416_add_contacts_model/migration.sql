-- CreateTable
CREATE TABLE "Contacts" (
    "contact_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("contact_id")
);
