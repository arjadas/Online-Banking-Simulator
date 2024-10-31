import { PrismaClient } from '@prisma/client';
import { makeSendReceiveNotifications } from './notificationService';
import { createUserPrevContact } from './userPrevContactService';

interface TransactionBase {
  fromAcc: number;
  amount: number;
  description: string;
  userId: string;
}

interface InternalTransferParams extends TransactionBase {
  type: 'internal';
  toAcc: number;
}

interface ExternalTransferParams extends TransactionBase {
  type: 'external';
  recipientAddress: string;
  reference: string;
  temporalTab: 'now' | 'later' | 'recurring';
  laterDate?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
}

type TransactionParams = InternalTransferParams | ExternalTransferParams;

export interface RecipientAddress {
  accountName: string;
  acc: number;
  bsb: number;
  billerCode: number;
  crn: number;
  payId: string;
}

export class TransactionService {
  constructor(private db: PrismaClient) {}

  private async validateAmount(amount: number, balance: number) {
    if (!amount) {
      throw new Error('Amount must be specified.');
    }

    if (balance < amount) {
      throw new Error('Insufficient funds.');
    }
  }

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

  private validateTemporalSettings(params: ExternalTransferParams) {
    const nowDate = new Date().getMilliseconds();

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

  private async updateContactIfNeeded(fromAccount: any, toAccount: any, reference: string, recipientAddress: string, context: any) {
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

  private async processImmediateTransaction(fromAccount: any, toAccount: any, amount: number, userId: string, description: string, type: 'transfer' | 'pay-someone', recipientAddress?: string, reference?: string) {
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

  private async processScheduledTransaction(params: ExternalTransferParams, fromAccount: any, toAccount: any) {
    if (params.temporalTab === 'later') {
      const laterDateISO = (new Date(params.laterDate!)).toISOString();

      return await this.db.recurringTransaction.create({
        data: {
          amount: params.amount,
          sender_acc: fromAccount.acc,
          recipient_acc: toAccount.acc,
          sender_uid: params.userId,
          recipient_uid: toAccount.uid,
          recipient_address: params.recipientAddress,
          reference: params.reference,
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
          recipient_address: params.recipientAddress,
          reference: params.reference,
          description: params.description,
          frequency: params.frequency!,
          starts_on: params.startDate!,
          ends_on: params.endDate || null,
        }
      });
    }
  }

  async createTransaction(params: TransactionParams, context?: any) {
    const fromAccount = await this.findFromAccount(params.fromAcc);
    const toAccount = await this.findToAccount(params);

    // Check for same account transfers
    if (fromAccount.acc === toAccount.acc) {
      throw new Error('Cannot transfer to the same account.');
    }

    await this.validateAmount(params.amount, fromAccount.balance);

    if (params.type === 'external') {
      this.validateTemporalSettings(params);
    }

    let result;

    if (params.type === 'internal' || (params.type === 'external' && params.temporalTab === 'now')) {
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
}