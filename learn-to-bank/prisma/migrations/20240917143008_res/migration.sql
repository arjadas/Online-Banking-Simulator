-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('salary', 'interest', 'transfer', 'paySomeone');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('administrator', 'student');

-- CreateEnum
CREATE TYPE "FontPreference" AS ENUM ('small', 'medium', 'large');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('transaction', 'reminder', 'message');

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "recipient_address" JSONB,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "recc_transaction_id" INTEGER,
    "settled" BOOLEAN NOT NULL,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "Account" (
    "acc" SERIAL NOT NULL,
    "bsb" INTEGER NOT NULL DEFAULT 123456,
    "acc_name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "pay_id" TEXT,
    "biller_code" INTEGER,
    "crn" INTEGER,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT,
    "opened_timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("acc")
);

-- CreateTable
CREATE TABLE "RecurringTransaction" (
    "recc_transaction_id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "recipient_address" JSONB NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "frequency" JSONB NOT NULL,

    CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("recc_transaction_id")
);

-- CreateTable
CREATE TABLE "MockUser" (
    "uid" TEXT NOT NULL,
    "first_name" TEXT,
    "middle_names" TEXT,
    "last_name" TEXT,
    "description" TEXT,
    "creation_timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockUser_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "DefaultTransaction" (
    "def_transaction_id" SERIAL NOT NULL,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "incoming" BOOLEAN NOT NULL,
    "amount" INTEGER NOT NULL,
    "recipient_address" JSONB NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "frequency" JSONB NOT NULL,

    CONSTRAINT "DefaultTransaction_pkey" PRIMARY KEY ("def_transaction_id")
);

-- CreateTable
CREATE TABLE "UserPrevContact" (
    "uid" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_uid" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,

    CONSTRAINT "UserPrevContact_pkey" PRIMARY KEY ("uid","contact_acc")
);

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_names" TEXT,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "font_preference" "FontPreference",
    "creation_timestamp" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recc_transaction_id_fkey" FOREIGN KEY ("recc_transaction_id") REFERENCES "RecurringTransaction"("recc_transaction_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_acc_fkey" FOREIGN KEY ("sender_acc") REFERENCES "Account"("acc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipient_acc_fkey" FOREIGN KEY ("recipient_acc") REFERENCES "Account"("acc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_sender_acc_fkey" FOREIGN KEY ("sender_acc") REFERENCES "Account"("acc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_recipient_acc_fkey" FOREIGN KEY ("recipient_acc") REFERENCES "Account"("acc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrevContact" ADD CONSTRAINT "UserPrevContact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
