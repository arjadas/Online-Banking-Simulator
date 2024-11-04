import { Account, PrismaClient } from '@prisma/client';
import { makeSendReceiveNotifications } from './notificationService';
import { createUserPrevContact } from './userPrevContactService';
import { blankRecipientAddress } from '../appSlice';

interface TransactionBase {
    fromAcc: number;
    amount: number;
    description: string;
    temporalTab: 'now' | 'later' | 'recurring';
    userId: string;
    laterDate?: string;
    frequency?: string;
    startDate?: string;
    endDate?: string;
}

interface InternalTransactionParams extends TransactionBase {
    type: 'internal';
    toAcc: number;
}

interface ExternalTransactionParams extends TransactionBase {
    type: 'external';
    recipientAddress: string;
    reference: string;
}

type TransactionParams = InternalTransactionParams | ExternalTransactionParams;

export interface RecipientAddress {
    accountName: string;
    acc: number;
    bsb: number;
    billerCode: number;
    crn: number;
    payId: string;
}

export class TransactionService {
    constructor(private db: PrismaClient) { }

    private async findFromAccount(fromAcc: number) {
        const fromAccount = await this.db.account.findUnique({
            where: { acc: fromAcc },
        });

        if (!fromAccount) {
            throw new Error('Sender account not found.');
        }

        return fromAccount;
    }

    private async findToAccount(params: TransactionParams) {
        if (params.type === 'internal') {
            const toAccount = await this.db.account.findUnique({
                where: { acc: params.toAcc },
            });

            if (!toAccount) {
                throw new Error('Recipient account not found.');
            }

            return toAccount;
        } else {
            let recipient: RecipientAddress;
            try {
                recipient = JSON.parse(params.recipientAddress);
            } catch (error) {
                throw new Error('Invalid recipient address format.');
            }

            const toAccount = await this.db.account.findFirst({
                where: {
                    OR: [
                        { acc_name: recipient.accountName, acc: recipient.acc, bsb: recipient.bsb },
                        { biller_code: recipient.billerCode, crn: recipient.crn },
                        { pay_id: recipient.payId }
                    ],
                },
            });

            if (!toAccount) {
                throw new Error('Recipient account not found.');
            }

            return toAccount;
        }
    }

    private validateForm(params: TransactionParams, fromAccount: Account, toAccount: Account) {
        const nowDate = new Date().getMilliseconds();

        if (fromAccount.acc === toAccount.acc) {
            throw new Error('Cannot transfer to the same account.');
        }

        if (!params.fromAcc || !fromAccount) {
            throw new Error('From account must be specified.');
        }

        if (!params.amount) {
            throw new Error('Amount must be specified.');
        }

        if (fromAccount.balance < params.amount) {
            throw new Error('Insufficient funds.');
        }

        if (params.temporalTab === 'later' && !params.laterDate) {
            throw new Error('Must specify a date and time when setting a future payment.');
        }

        if (params.temporalTab === 'recurring') {
            if (!params.frequency) {
                throw new Error('Must specify a frequency when setting a recurring payment.');
            }

            if (!params.startDate) {
                throw new Error('Must specify a start date when setting a recurring payment.');
            }

            if (Date.parse(params.startDate) < nowDate) {
                throw new Error('The date this payment will start occurring must not be in the past.');
            }

            if (params.endDate && Date.parse(params.endDate) <= nowDate) {
                throw new Error('The date this payment will stop occurring must be in the future.');
            }
        }
    }

    private async updateContactIfNeeded(fromAccount: Account, toAccount: Account, reference: string, recipientAddress: string, context: any) {
        const existingContact = await this.db.userPrevContact.findFirst({
            where: {
                uid: fromAccount.uid,
                contact_acc: toAccount.acc
            }
        });

        if (!existingContact) {
            await createUserPrevContact(context, {
                uid: fromAccount.uid,
                contact_acc: toAccount.acc,
                contact_acc_name: toAccount.acc_name,
                contact_description: reference,
                contact_recipient_address: recipientAddress,
            });
        }
    }

    private async processImmediateTransaction(fromAccount: Account, toAccount: Account, amount: number, userId: string, description: string, type: 'transfer' | 'pay-someone', recipientAddress?: string, reference?: string) {
        return await this.db.$transaction([
            this.db.account.update({
                where: { acc: fromAccount.acc },
                data: { balance: { decrement: amount } },
            }),
            this.db.account.update({
                where: { acc: toAccount.acc },
                data: { balance: { increment: amount } },
            }),
            this.db.transaction.create({
                data: {
                    amount,
                    sender_acc: fromAccount.acc,
                    recipient_acc: toAccount.acc,
                    sender_uid: userId,
                    recipient_uid: type === 'transfer' ? userId : toAccount.uid,
                    reference: type === 'transfer'
                        ? `Transfer from ${fromAccount.short_description} to ${toAccount.short_description}`
                        : reference!,
                    description,
                    timestamp: new Date(),
                    settled: true,
                    type,
                    ...(recipientAddress && { recipient_address: recipientAddress }),
                },
            }),
        ]);
    }

    private async processScheduledTransaction(params: TransactionParams, fromAccount: Account, toAccount: Account) {
        if (params.temporalTab === 'later') {
            const laterDateISO = (new Date(params.laterDate!)).toISOString();

            return await this.db.recurringTransaction.create({
                data: {
                    amount: params.amount,
                    sender_acc: fromAccount.acc,
                    recipient_acc: toAccount.acc,
                    sender_uid: params.userId,
                    recipient_uid: toAccount.uid,
                    recipient_address: params.type === 'external' ? params.recipientAddress : '',
                    reference: params.type === 'external' ? params.reference : '',
                    description: params.description,
                    frequency: '{}',
                    starts_on: laterDateISO,
                    ends_on: laterDateISO,
                }
            });
        } else {
            return await this.db.recurringTransaction.create({
                data: {
                    amount: params.amount,
                    sender_acc: fromAccount.acc,
                    recipient_acc: toAccount.acc,
                    sender_uid: params.userId,
                    recipient_uid: toAccount.uid,
                    recipient_address: params.type === 'external' ? params.recipientAddress : '',
                    reference: params.type === 'external' ? params.reference : '',
                    description: params.description,
                    frequency: params.frequency!,
                    starts_on: params.startDate!,
                    ends_on: params.endDate || null,
                }
            });
        }
    }

    private cleanRecipientAddress(addressStr: string): string {
        const cleaned: Partial<RecipientAddress> = {};
        const address = JSON.parse(addressStr);

        if (address.accountName !== blankRecipientAddress.accountName) {
            cleaned.accountName = address.accountName;
        }

        if (address.acc !== blankRecipientAddress.acc) {
            cleaned.acc = address.acc;
        }

        if (address.bsb !== blankRecipientAddress.bsb) {
            cleaned.bsb = address.bsb;
        }

        if (address.payId !== blankRecipientAddress.payId) {
            cleaned.payId = address.payId;
        }

        if (address.billerCode !== blankRecipientAddress.billerCode) {
            cleaned.billerCode = address.billerCode;
        }

        if (address.crn !== blankRecipientAddress.crn) {
            cleaned.crn = address.crn;
        }

        return JSON.stringify(cleaned);
    }

    async createTransaction(params: TransactionParams, context?: any) {
        const fromAccount = await this.findFromAccount(params.fromAcc);
        const toAccount = await this.findToAccount(params);
        let result;

        if ('recipientAddress' in params) {
            params.recipientAddress = this.cleanRecipientAddress(params.recipientAddress);
        }

        this.validateForm(params, fromAccount, toAccount);

        if (params.temporalTab === 'now') {
            result = await this.processImmediateTransaction(
                fromAccount,
                toAccount,
                params.amount,
                params.userId,
                params.description,
                params.type === 'internal' ? 'transfer' : 'pay-someone',
                params.type === 'external' ? params.recipientAddress : undefined,
                params.type === 'external' ? params.reference : undefined
            );

            if (params.type === 'external') {
                await this.updateContactIfNeeded(
                    fromAccount,
                    toAccount,
                    params.reference,
                    params.recipientAddress,
                    context
                );

                makeSendReceiveNotifications(context, toAccount, fromAccount, params.amount);
            }
        } else {
            result = await this.processScheduledTransaction(params, fromAccount, toAccount);
        }

        return result;
    }

    async editRecurringTransactionDateTime(transactionID: number, frequency: string, startDate: string, endDate: string) {

        try {
            const beforeUpdate = await this.db.recurringTransaction.findUnique({
                where: { recc_transaction_id: transactionID },
            });

            let afterUpdate;

            if (endDate) {
                afterUpdate = await this.db.recurringTransaction.update({
                    where: { recc_transaction_id: transactionID },
                    data: { frequency: frequency, starts_on: startDate, ends_on: endDate },
                });
            } else {
                afterUpdate = await this.db.recurringTransaction.update({
                    where: { recc_transaction_id: transactionID },
                    data: { frequency: frequency, starts_on: startDate, ends_on: null },
                });
            }

            console.log(beforeUpdate, afterUpdate, "update successful");
        } catch (error) {
            console.error("Updating error", error);
        }
    }

    async deleteTransaction(transactionID: number) {
        return await this.db.recurringTransaction.delete({
            where: { recc_transaction_id: transactionID },
        });
    }
}