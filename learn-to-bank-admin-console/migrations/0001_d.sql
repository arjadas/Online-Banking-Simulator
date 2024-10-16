

DROP TABLE IF EXISTS "Transaction";
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

DROP TABLE IF EXISTS "Account";
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

DROP TABLE IF EXISTS "RecurringTransaction";
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

DROP TABLE IF EXISTS "MockUser";
CREATE TABLE "MockUser" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "middle_names" TEXT,
    "last_name" TEXT,
    "description" TEXT,
    "creation_timestamp" DATETIME NOT NULL
);

DROP TABLE IF EXISTS "UserPrevContact";
CREATE TABLE "UserPrevContact" (
    "user_prev_contact_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "contact_acc" INTEGER NOT NULL,
    "contact_acc_name" TEXT NOT NULL,
    "contact_uid" TEXT NOT NULL,
    "contact_description" TEXT NOT NULL,
    CONSTRAINT "UserPrevContact_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "User";
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

DROP TABLE IF EXISTS "Notification";
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert mock data into User table
INSERT INTO "User" ("uid", "first_name", "middle_names", "last_name", "email", "role", "font_preference", "creation_timestamp", "last_login")
VALUES 
('xvbW2ZOAB2bx5yZ7j9MioilmELM2', 'John', NULL, 'Doe', 'john.doe@example.com', 'administrator', 'Arial', '2023-01-01 00:00:00', '2023-06-15 14:30:00'),
('yWcX3YPBC3cy6zA8k0NjpjmnFLN3', 'Jane', NULL, 'day', 'jane.day@example.com', 'customer', 'student', '2023-01-01 00:00:00', '2023-06-15 14:30:00');

-- Insert mock data into Account table
INSERT INTO "Account" ("acc", "acc_name", "uid", "balance", "pay_id", "short_description", "opened_timestamp")
VALUES 
(1001, 'Savings Account', 'xvbW2ZOAB2bx5yZ7j9MioilmELM2', 5000, 'john.doe@example.com', 'Primary savings', '2023-01-02 09:00:00'),
(1002, 'Checking Account', 'xvbW2ZOAB2bx5yZ7j9MioilmELM2', 2500, NULL, 'Daily expenses', '2023-01-02 09:15:00');

-- Insert mock data into Transaction table
INSERT INTO "Transaction" ("amount", "sender_acc", "recipient_acc", "sender_uid", "recipient_uid", "reference", "timestamp", "settled", "type")
VALUES 
(1000, 1001, 1002, 'xvbW2ZOAB2bx5yZ7j9MioilmELM2', 'yWcX3YPBC3cy6zA8k0NjpjmnFLN3', 'Transfer to Joint', '2023-06-01 13:45:00', TRUE, 'transfer');