/*
  Warnings:

  - The primary key for the `UserPrevContact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `user_prev_contact_id` to the `UserPrevContact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPrevContact" DROP CONSTRAINT "UserPrevContact_pkey",
ADD COLUMN     "user_prev_contact_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserPrevContact_pkey" PRIMARY KEY ("user_prev_contact_id");
