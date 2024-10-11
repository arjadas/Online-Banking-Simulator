INSERT INTO "User" ("uid", "first_name", "middle_names", "last_name", "email", "role", "font_preference", "creation_timestamp", "last_login")
VALUES 
('user1', 'John', NULL, 'Doe', 'john.doe@example.com', 'customer', 'Arial', '2023-01-01 00:00:00', '2023-06-15 14:30:00'),
('user2', 'Jane', 'Marie', 'Smith', 'jane.smith@example.com', 'customer', 'Helvetica', '2023-02-15 10:30:00', '2023-06-14 09:15:00');

-- Insert mock data into Account table
INSERT INTO "Account" ("acc", "acc_name", "uid", "balance", "pay_id", "short_description", "opened_timestamp")
VALUES 
(1001, 'Savings Account', 'user1', 5000, 'john.doe@example.com', 'Primary savings', '2023-01-02 09:00:00'),
(1002, 'Checking Account', 'user1', 2500, NULL, 'Daily expenses', '2023-01-02 09:15:00'),
(2001, 'Joint Account', 'user2', 10000, 'jane.smith@example.com', 'Shared account', '2023-02-16 11:00:00');

-- Insert mock data into Transaction table
INSERT INTO "Transaction" ("amount", "sender_acc", "recipient_acc", "sender_uid", "recipient_uid", "reference", "timestamp", "settled", "type")
VALUES 
(1000, 1001, 2001, 'user1', 'user2', 'Transfer to Joint', '2023-06-01 13:45:00', TRUE, 'transfer'),
(500, 2001, 1002, 'user2', 'user1', 'Rent payment', '2023-06-05 09:30:00', TRUE, 'payment');

-- Insert mock data into RecurringTransaction table
INSERT INTO "RecurringTransaction" ("amount", "sender_acc", "recipient_acc", "sender_uid", "recipient_uid", "recipient_address", "reference", "frequency")
VALUES 
(200, 1002, 2001, 'user1', 'user2', '123 Main St, Anytown', 'Monthly subscription', 'monthly');

-- Insert mock data into DefaultTransaction table
INSERT INTO "DefaultTransaction" ("sender_uid", "recipient_uid", "sender_acc", "recipient_acc", "incoming", "amount", "recipient_address", "reference", "frequency")
VALUES 
('user1', 'user2', 1001, 2001, FALSE, 500, '456 Elm St, Othertown', 'Regular transfer', 'weekly');

-- Insert mock data into UserPrevContact table
INSERT INTO "UserPrevContact" ("uid", "contact_acc", "contact_acc_name", "contact_uid", "contact_description")
VALUES 
('user1', 2001, 'Jane Smith', 'user2', 'Friend');

-- Insert mock data into Notification table
INSERT INTO "Notification" ("notification_id", "uid", "timestamp", "type", "content", "read")
VALUES 
('notif1', 'user1', '2023-06-15 15:00:00', 'transaction', 'You received a payment of $500', FALSE),
('notif2', 'user2', '2023-06-15 15:01:00', 'system', 'Your account statement is ready', TRUE);