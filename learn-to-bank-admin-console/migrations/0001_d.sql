-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "sender_acc" INTEGER NOT NULL,
    "recipient_acc" INTEGER NOT NULL,
    "sender_uid" TEXT NOT NULL,
    "recipient_uid" TEXT NOT NULL,
    "recipient_address" TEXT,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "timestamp" DATETIME NOT NULL,
    "recc_transaction_id" INTEGER,
    "settled" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Transaction_recc_transaction_id_fkey" FOREIGN KEY ("recc_transaction_id") REFERENCES "RecurringTransaction" ("recc_transaction_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_sender_acc_fkey" FOREIGN KEY ("sender_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_recipient_acc_fkey" FOREIGN KEY ("recipient_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "acc" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bsb" INTEGER NOT NULL DEFAULT 123456,
    "acc_name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
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
    "middle_names" TEXT,
    "last_name" TEXT,
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
    "frequency" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserPrevContact" (
    "user_prev_contact_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_uid" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,
    CONSTRAINT "UserPrevContact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "middle_names" TEXT,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "font_preference" TEXT,
    "creation_timestamp" DATETIME NOT NULL,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);