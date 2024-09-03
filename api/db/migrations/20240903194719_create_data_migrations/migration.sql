-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "RW_DataMigration" (
    "version" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "finishedAt" DATETIME NOT NULL
);
