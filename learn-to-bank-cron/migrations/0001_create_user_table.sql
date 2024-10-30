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
    "starts_on" DATETIME NOT NULL,
    "ends_on" DATETIME,
    CONSTRAINT "RecurringTransaction_sender_acc_fkey" FOREIGN KEY ("sender_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecurringTransaction_recipient_acc_fkey" FOREIGN KEY ("recipient_acc") REFERENCES "Account" ("acc") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "card_number" TEXT NOT NULL,
    "expiry_date" TEXT NOT NULL,
    "csc" TEXT NOT NULL,
    "cardholder_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditCard_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("acc") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DebitCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "card_number" TEXT NOT NULL,
    "expiry_date" TEXT NOT NULL,
    "csc" TEXT NOT NULL,
    "cardholder_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DebitCard_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("acc") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE TABLE "UserPrevContact" (
    "user_prev_contact_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,
    "contact_recipient_address" TEXT NOT NULL
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

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_accountId_key" ON "CreditCard"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_card_number_key" ON "CreditCard"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "DebitCard_accountId_key" ON "DebitCard"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "DebitCard_card_number_key" ON "DebitCard"("card_number");
