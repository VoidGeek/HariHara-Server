/*
  Warnings:

  - You are about to drop the `Acknowledgments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DonationRecords` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Receipts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Acknowledgments" DROP CONSTRAINT "Acknowledgments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "DonationRecords" DROP CONSTRAINT "DonationRecords_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "DonationRecords" DROP CONSTRAINT "DonationRecords_user_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_seva_id_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "Receipts" DROP CONSTRAINT "Receipts_order_id_fkey";

-- DropTable
DROP TABLE "Acknowledgments";

-- DropTable
DROP TABLE "DonationRecords";

-- DropTable
DROP TABLE "OrderDetails";

-- DropTable
DROP TABLE "Orders";

-- DropTable
DROP TABLE "Payments";

-- DropTable
DROP TABLE "Receipts";
