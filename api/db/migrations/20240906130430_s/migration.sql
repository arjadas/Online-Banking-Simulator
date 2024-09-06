/*
  Warnings:

  - The primary key for the `UserPrevContact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `UserPrevContact` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `UserPrevContact` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPrevContact" (
    "user_id" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_uid" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,

    PRIMARY KEY ("user_id", "contact_acc"),
    CONSTRAINT "UserPrevContact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPrevContact" ("contact_acc", "contact_acc_name", "contact_description", "contact_uid") SELECT "contact_acc", "contact_acc_name", "contact_description", "contact_uid" FROM "UserPrevContact";
DROP TABLE "UserPrevContact";
ALTER TABLE "new_UserPrevContact" RENAME TO "UserPrevContact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
