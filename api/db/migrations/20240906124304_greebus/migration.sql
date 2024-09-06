/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `recipient_acc` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_address` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_uid` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_acc` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_uid` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settled` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Account" (
    "acc" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acc_name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "pay_id" TEXT,
    "biller_code" INTEGER,
    "crn" INTEGER,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT,
    "opened_timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecurringTransaction" (
    "recc_transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "recipient_address" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "frequency" TEXT NOT NULL,
    CONSTRAINT "RecurringTransaction_sender_acc_fkey" FOREIGN KEY ("sender_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecurringTransaction_recipient_acc_fkey" FOREIGN KEY ("recipient_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MockUser" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "surname" TEXT,
    "description" TEXT,
    "creation_timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DefaultTransaction" (
    "def_transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "incoming" BOOLEAN NOT NULL,
    "amount" INTEGER NOT NULL,
    "recipient_address" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "frequency" TEXT
);

-- CreateTable
CREATE TABLE "UserPrevContact" (
    "uid" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_uid" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,

    PRIMARY KEY ("uid", "contact_acc"),
    CONSTRAINT "UserPrevContact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "font_preference" TEXT,
    "creation_timestamp" DATETIME NOT NULL,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'message',
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "recipient_address" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "timestamp" DATETIME NOT NULL,
    "recc_transaction_id" INTEGER,
    "settled" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'transfer',
    CONSTRAINT "Transaction_sender_acc_fkey" FOREIGN KEY ("sender_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_recipient_acc_fkey" FOREIGN KEY ("recipient_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_recc_transaction_id_fkey" FOREIGN KEY ("recc_transaction_id") REFERENCES "RecurringTransaction" ("recc_transaction_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "description", "reference") SELECT "amount", "description", "reference" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
