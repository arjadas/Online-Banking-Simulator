/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RecurringTransaction, Transaction } from "@prisma/client";
import { getTransactionsForPeriodBulk } from "./util/futureTransactionUtil";
import { toFixedWithCommas } from "./util/util";

export interface Env {
	// @ts-ignore
	DB: D1Database;
}

// We'll use Primsa for types, but it doesn't seem to work for this codebase easily and we'll use raw queries in the interest of time.
const SQL_QUERIES = {
	GET_ALL_RECURRING_TRANSACTIONS: `
    SELECT 
      rt.recc_transaction_id,
      rt.amount,
      rt.sender_acc,
      rt.recipient_acc,
      rt.sender_uid,
      rt.recipient_uid,
      rt.recipient_address,
      rt.reference,
      rt.description,
      rt.frequency,
      rt.starts_on,
      rt.ends_on
    FROM main.RecurringTransaction rt
  `,
	GET_TRANSACTION_BY_DATE_AND_REC_ID: `
    SELECT 
      t.transaction_id,
      t.amount,
      t.sender_acc,
      t.recipient_acc,
      t.sender_uid,
      t.recipient_uid,
      t.recipient_address,
      t.reference,
      t.description,
      t.timestamp,
      t.recc_transaction_id,
      t.settled,
      t.type
    FROM main.\`Transaction\` t
    WHERE t.recc_transaction_id = ?
    AND DATE(t.timestamp) = DATE(?)
  `,
	INSERT_TRANSACTION: `
	INSERT INTO main.\`Transaction\` (
		amount,
		sender_acc,
		recipient_acc,
		sender_uid,
		recipient_uid,
		recipient_address,
		reference,
		description,
		timestamp,
		recc_transaction_id,
		settled,
		type
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
	INSERT_NOTIFICATION: `
	INSERT INTO main.Notification (
			notification_id,
			uid,
			timestamp,
			type,
			content,
			read
	) VALUES (?, ?, ?, ?, ?, ?)
	`,
	GET_ACCOUNT_DETAILS: `
	SELECT 
			a.acc_name,
			a.uid
	FROM main.Account a
	WHERE a.acc = ?
	`
} as const;

// @ts-ignore
async function createTransaction(db: D1Database, transaction: RecurringTransaction, generatedDate: Date): Promise<RecurringTransaction> {
	try {
		// Create a new transaction based on the recurring transaction template
		const stmt = db.prepare(SQL_QUERIES.INSERT_TRANSACTION)
			.bind(
				transaction.amount,
				transaction.sender_acc,
				transaction.recipient_acc,
				transaction.sender_uid,
				transaction.recipient_uid,
				transaction.recipient_address,
				transaction.reference,
				transaction.description,
				generatedDate.toISOString(),
				transaction.recc_transaction_id,
				1,
				'recurring',
			);

		const result = await stmt.run();

		if (!result.success) {
			throw new Error(`Failed to create transaction: ${result.error}`);
		}

		console.log(`Created transaction for recurring payment ID ${transaction.recc_transaction_id} for date ${generatedDate.toISOString()}`);

		return result;
	} catch (error) {
		console.error('Error creating transaction:', error);
		throw error;
	}
}

// @ts-ignore
async function fetchTransactionByDateAndRecId(db: D1Database, recurringTransactionId: number, date: Date): Promise<Transaction | null> {
	try {
		const stmt = db.prepare(SQL_QUERIES.GET_TRANSACTION_BY_DATE_AND_REC_ID)
			.bind(recurringTransactionId, date.toISOString());

		const result = await stmt.first<Transaction>();

		if (!result) {
			return null;
		}

		return result;
	} catch (error) {
		console.error('Error fetching transaction:', error);
		throw error;
	}
}

// @ts-ignore
async function fetchRecurringTransactions(db: D1Database): Promise<RecurringTransaction[]> {
	try {
		const stmt = db.prepare(SQL_QUERIES.GET_ALL_RECURRING_TRANSACTIONS);
		const result = await stmt.all<RecurringTransaction>();

		if (!result.success) {
			throw new Error('Failed to fetch from database');
		}

		return result.results;
	} catch (error) {
		console.error('Error fetching:', error);
		throw error;
	}
}

// @ts-ignore
async function getAccountDetails(db: D1Database, accountId: number): Promise<{ acc_name: string; uid: string; } | null> {
	try {
		const stmt = db.prepare(SQL_QUERIES.GET_ACCOUNT_DETAILS)
			.bind(accountId);

		const result = await stmt.first<{ acc_name: string; uid: string; }>();

		if (!result) {
			return null;
		}

		return result;
	} catch (error) {
		console.error('Error fetching account details:', error);
		throw error;
	}
}

// @ts-ignore
async function createNotificationRaw(db: D1Database, notificationData: {
	notification_id: string;
	uid: string;
	timestamp: Date;
	type: string;
	content: string;
	read: boolean;
}): Promise<void> {
	try {
		const stmt = db.prepare(SQL_QUERIES.INSERT_NOTIFICATION)
			.bind(
				notificationData.notification_id,
				notificationData.uid,
				notificationData.timestamp.toISOString(),
				notificationData.type,
				notificationData.content,
				notificationData.read ? 1 : 0
			);

		const result = await stmt.run();

		if (!result.success) {
			throw new Error(`Failed to create notification: ${result.error}`);
		}

		console.log(`Created notification for user ${notificationData.uid}`);

	} catch (error) {
		console.error('Error creating notification:', error);
		throw error;
	}
}

// @ts-ignore
export async function createTransactionNotifications(db: D1Database, toAccountId: number, fromAccountId: number, amount: number): Promise<void> {
	const now = new Date();

	try {
		const toAccount = await getAccountDetails(db, toAccountId);
		const fromAccount = await getAccountDetails(db, fromAccountId);

		if (!toAccount || !fromAccount) {
			throw new Error('Could not find account details');
		}

		const amountFormatted = toFixedWithCommas(amount / 100);

		// Create notification for recipient
		try {
			await createNotificationRaw(db, {
				notification_id: `${now.toUTCString()}_${toAccount.uid}`,
				uid: toAccount.uid,
				timestamp: now,
				type: 'new-receipt',
				content: `Received $${amountFormatted} from ${fromAccount.acc_name}`,
				read: false
			});
		} catch (e) {
			// mock user
		}

		// Create notification for sender
		await createNotificationRaw(db, {
			notification_id: `${now.toUTCString()}_${fromAccount.uid}_1`,
			uid: fromAccount.uid,
			timestamp: now,
			type: 'transfer-success',
			content: `Successfully transferred $${amountFormatted} to ${toAccount.acc_name}`,
			read: false
		});

	} catch (error) {
		console.error('Error creating transaction notifications:', error);
		throw error;
	}
}

// Lock for testing, not necessary for production
const processedSchedules = new Set<string>();

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return new Response(
			JSON.stringify({
				status: 'healthy',
				timestamp: new Date().toISOString(),
				request, env, ctx
			}),
		);
	},

	async scheduled(
		event: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		//TODO
		const scheduleKey = event.scheduledTime.toString();

		if (processedSchedules.has(scheduleKey)) {
			console.log('Skipping duplicate schedule execution');
			return;
		}

		processedSchedules.add(scheduleKey);

		ctx.waitUntil((async () => {
			try {
				const recurringTransactions = await fetchRecurringTransactions(env.DB);

				for (const generatedTransaction of getTransactionsForPeriodBulk(recurringTransactions)) {
					if (generatedTransaction.generatedDate.getTime() < new Date().getTime()) {
						const transaction = generatedTransaction.transaction;
						const existingTransaction = await fetchTransactionByDateAndRecId(env.DB, generatedTransaction.transaction.recc_transaction_id, generatedTransaction.generatedDate);

						// Write a generated transaction if it doesn't exist
						if (!existingTransaction) {
							await createTransaction(env.DB, generatedTransaction.transaction, generatedTransaction.generatedDate);
							await createTransactionNotifications(
								env.DB,
								transaction.recipient_acc,
								transaction.sender_acc,
								transaction.amount
							);
						}
					}
				}
			} catch (error) {
				console.error('Scheduled task failed:', error);
				throw error;
			}
		})());
	},
};