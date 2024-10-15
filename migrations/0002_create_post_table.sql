-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPrevContact" (
    "user_prev_contact_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_uid" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,
    "contact_recipient_address" TEXT NOT NULL,
    CONSTRAINT "UserPrevContact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserPrevContact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "MockUser" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPrevContact" ("contact_acc", "contact_acc_name", "contact_description", "contact_uid", "uid", "user_prev_contact_id") SELECT "contact_acc", "contact_acc_name", "contact_description", "contact_uid", "uid", "user_prev_contact_id" FROM "UserPrevContact";
DROP TABLE "UserPrevContact";
ALTER TABLE "new_UserPrevContact" RENAME TO "UserPrevContact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
