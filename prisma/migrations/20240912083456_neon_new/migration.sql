/*
  Warnings:

  - The `bsb` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'paySomeone';

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "bsb",
ADD COLUMN     "bsb" INTEGER NOT NULL DEFAULT 123456;
