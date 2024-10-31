import { PrismaD1 } from '@prisma/adapter-d1';
import { getPrismaClient } from '~/service/db.server';

function generateCardNumber() {
    let cardNumber = '';

    for (let i = 0; i < 16; i++) {
        cardNumber += Math.floor(Math.random() * 10).toString();
    }

    return cardNumber;
}

function generateCSC(){
    return Math.floor(100 + Math.random() * 900).toString();
}

function generateExpiryDate(creationDate: Date, monthsToExpire: number): string {
    const expiryDate = new Date(creationDate);
  
    expiryDate.setMonth(expiryDate.getMonth() + monthsToExpire);
  
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expiryDate.getFullYear().toString().slice(-2);
  
    return `${month}/${year}`;
}

async function generateUniqueCardNumber(context: any) {
    const db = getPrismaClient(context);
    let cardNumber: string;
    let existingCreditCard = null;
    let existingDebitCard = null;
  
    do {
      cardNumber = generateCardNumber();
      existingCreditCard = await db.creditCard.findUnique({
        where: { card_number: cardNumber },
      });
      existingDebitCard = await db.debitCard.findUnique({
        where: { card_number: cardNumber },
      });
    } while (existingCreditCard || existingDebitCard);
  
    return cardNumber;
}

export async function openCard(
    context: any, 
    accountAcc: number, 
    firstName: string, 
    lastName: string, 
    duration: number, 
    cardType: string) {

    const adapter = new PrismaD1(context.cloudflare.env.DB);
    const db = getPrismaClient(context);
    const date = new Date();

    try {
        if (cardType === "credit") {
            const existingCreditCard = await db.creditCard.findUnique({
                where: { accountId: accountAcc },
            });

            if (existingCreditCard) {
                console.error(`Credit card already exists`);
                throw new Error(`Credit card already exists for this account.`);
            }

            const cardNumber = await generateUniqueCardNumber(context);

            return await db.creditCard.create({
                data: {
                    accountId: accountAcc,
                    card_number: cardNumber,
                    expiry_date: generateExpiryDate(date, duration),
                    csc: generateCSC(),
                    cardholder_name: `${firstName} ${lastName}`,
                    created_at: date,
                },
            });
        }
        if (cardType === "debit") {
            const existingDebitCard = await db.debitCard.findUnique({
                where: { accountId: accountAcc },
            });

            if (existingDebitCard) {
                console.error(`Debit card already exists`);
                throw new Error(`Debit card already exists for this account.`);
            }

            const cardNumber = await generateUniqueCardNumber(context);

            return await db.debitCard.create({
                data: {
                    accountId: accountAcc,
                    card_number: cardNumber,
                    expiry_date: generateExpiryDate(date, duration),
                    csc: generateCSC(),
                    cardholder_name: `${firstName} ${lastName}`,
                    created_at: date,
                },
            });
        }
        throw new Error("Possible card type mismatch")
    } catch (error: any) {
        throw new Error(`Failed to create new card ${error.message}`);
    }
}