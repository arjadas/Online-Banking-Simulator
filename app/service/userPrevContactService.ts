import { Prisma } from '@prisma/client';
import { getPrismaClient } from '~/service/db.server';

export async function createUserPrevContact(context: any, data: Prisma.UserPrevContactCreateInput) {
    const db = getPrismaClient(context);

    return await db.userPrevContact.create({
        data: data,
    });
}

export async function createMockUserPrevContacts(context: any, uid: string) {
    const db = getPrismaClient(context);
    const mockUsers = await db.mockUser.findMany();

    for (const mockUser of mockUsers) {
        const mockUserAccount = await db.account.findFirst({ where: { uid: mockUser.uid } });
        let recipientAddress = "";

        if (!mockUserAccount) {
            throw new Error("Mock user account not found.");
        }

        if (mockUser.uid === "ELEC123456") {
            recipientAddress = `{"billerCode": ${mockUserAccount.biller_code}, "crn":${mockUserAccount.crn}}`
        } else if (mockUser.uid === "LAND789012") {
            recipientAddress = `{"accountName":"${mockUserAccount.acc_name}", "acc":${mockUserAccount.acc}, "bsb": ${mockUserAccount.bsb}}`
        }

        await db.userPrevContact.create({
            data: {
                uid: uid,
                contact_acc_name: mockUserAccount.acc_name,
                contact_description: mockUser.description ?? mockUser.first_name + " " + mockUser.last_name,
                contact_acc: mockUserAccount.acc,
                contact_recipient_address: recipientAddress,
            },
        });
    }
}

