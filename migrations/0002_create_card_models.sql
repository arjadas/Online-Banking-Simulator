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

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_accountId_key" ON "CreditCard"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_card_number_key" ON "CreditCard"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "DebitCard_accountId_key" ON "DebitCard"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "DebitCard_card_number_key" ON "DebitCard"("card_number");
