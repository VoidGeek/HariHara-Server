-- CreateTable
CREATE TABLE "Roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "profile_image_id" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Sevas" (
    "seva_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "base_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Sevas_pkey" PRIMARY KEY ("seva_id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "order_detail_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "seva_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("order_detail_id")
);

-- CreateTable
CREATE TABLE "Receipts" (
    "receipt_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "amount_paid" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_status" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,

    CONSTRAINT "Receipts_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateTable
CREATE TABLE "Acknowledgments" (
    "acknowledgment_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "acknowledgment_number" TEXT NOT NULL,
    "acknowledged_date" TIMESTAMP(3) NOT NULL,
    "message" TEXT,

    CONSTRAINT "Acknowledgments_pkey" PRIMARY KEY ("acknowledgment_id")
);

-- CreateTable
CREATE TABLE "DonationRecords" (
    "donation_record_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "donation_amount" DECIMAL(65,30) NOT NULL,
    "donation_date" TIMESTAMP(3) NOT NULL,
    "certificate_number" TEXT NOT NULL,
    "tax_deductible" BOOLEAN NOT NULL,
    "receipt_id" INTEGER,

    CONSTRAINT "DonationRecords_pkey" PRIMARY KEY ("donation_record_id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "payment_id" SERIAL NOT NULL,
    "receipt_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_status" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Images" (
    "image_id" SERIAL NOT NULL,
    "supabase_url" TEXT NOT NULL,
    "alt_text" TEXT,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "ImageAssociations" (
    "association_id" SERIAL NOT NULL,
    "image_id" INTEGER NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "entity_type" TEXT NOT NULL,

    CONSTRAINT "ImageAssociations_pkey" PRIMARY KEY ("association_id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "gallery_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("gallery_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Receipts_order_id_key" ON "Receipts"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Acknowledgments_order_id_key" ON "Acknowledgments"("order_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_profile_image_id_fkey" FOREIGN KEY ("profile_image_id") REFERENCES "Images"("image_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_seva_id_fkey" FOREIGN KEY ("seva_id") REFERENCES "Sevas"("seva_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipts" ADD CONSTRAINT "Receipts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acknowledgments" ADD CONSTRAINT "Acknowledgments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRecords" ADD CONSTRAINT "DonationRecords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRecords" ADD CONSTRAINT "DonationRecords_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "Receipts"("receipt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "Receipts"("receipt_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAssociations" ADD CONSTRAINT "ImageAssociations_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Images"("image_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAssociations" ADD CONSTRAINT "ImageAssociations_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Gallery"("gallery_id") ON DELETE RESTRICT ON UPDATE CASCADE;
