-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecurringTransaction" (
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
INSERT INTO "new_RecurringTransaction" ("amount", "description", "frequency", "recc_transaction_id", "recipient_acc", "recipient_address", "recipient_uid", "reference", "sender_acc", "sender_uid") SELECT "amount", "description", "frequency", "recc_transaction_id", "recipient_acc", "recipient_address", "recipient_uid", "reference", "sender_acc", "sender_uid" FROM "RecurringTransaction";
DROP TABLE "RecurringTransaction";
ALTER TABLE "new_RecurringTransaction" RENAME TO "RecurringTransaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
