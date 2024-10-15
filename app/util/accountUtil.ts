import { PrismaD1 } from '@prisma/adapter-d1';
import { Prisma } from '@prisma/client';
import { getPrismaClient } from '~/util/db.server';

// Generate a random 9-digit number
function generateRandomAcc() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

export async function openAccount(context: any, data: Prisma.AccountCreateInput) {
    let acc: number = 0;
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    const db = getPrismaClient(context);
    let isUnique = false;

    while (!isUnique) {
        acc = generateRandomAcc();
        const existingAccount = await db.account.findUnique({
            where: { acc },
        });
        if (!existingAccount) {
            isUnique = true;
        }
    }

    return await db.account.create({
        data: {
            ...data,
            acc,
        },
    });
}

function generateCardNumber() {
    let cardNumber = '';

    for (let i = 0; i < 16; i++) {
        cardNumber += Math.floor(Math.random() * 10).toString();
    }

    return cardNumber;
}

export function generateCSC(){
    return Math.floor(100 + Math.random() * 900).toString();
}

export function generateExpiryDate(creationDate: Date, monthsToExpire: number): string {
    const expiryDate = new Date(creationDate);
  
    expiryDate.setMonth(expiryDate.getMonth() + monthsToExpire);
  
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expiryDate.getFullYear().toString().slice(-2);
  
    return `${month}/${year}`;
}

export async function generateUniqueCardNumber(context: any) {
    const db = getPrismaClient(context);
    let cardNumber;
  
    do {
      cardNumber = generateCardNumber();
      const existingCreditCard = await db.creditCard.findUnique({
        where: { card_number: cardNumber },
      });
      const existingDebitCard = await db.debitCard.findUnique({
        where: { card_number: cardNumber },
      });
    } while (existingCreditCard || existingDebitCard);
  
    return cardNumber;
}