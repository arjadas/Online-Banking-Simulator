/*
  Warnings:

  - You are about to drop the column `surname` on the `MockUser` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `User` table. All the data in the column will be lost.
  - Added the required column `pay_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `recipient_address` on the `DefaultTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `frequency` to the `DefaultTransaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `recipient_address` on the `RecurringTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `frequency` on the `RecurringTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recipient_address` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middle_names` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "pay_id",
ADD COLUMN     "pay_id" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "DefaultTransaction" DROP COLUMN "recipient_address",
ADD COLUMN     "recipient_address" JSONB NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "MockUser" DROP COLUMN "surname",
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "middle_names" TEXT;

-- AlterTable
ALTER TABLE "RecurringTransaction" DROP COLUMN "recipient_address",
ADD COLUMN     "recipient_address" JSONB NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "recipient_address",
ADD COLUMN     "recipient_address" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "surname",
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "middle_names" TEXT NOT NULL;
