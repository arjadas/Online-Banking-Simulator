import { Card, Select, Tabs } from '@geist-ui/core';
import { Button, Input, Page, Text, Textarea } from '@geist-ui/react';
import { Account } from '@prisma/client';
import { ActionFunction, LoaderFunction, json } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import CurrencyInput from '~/components/CurrencyInput';
import { getPrismaClient } from '~/util/db.server';
import { getUserSession } from '../auth.server';
import "../styles/app.paySomeone.css";

export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
    const formData = await request.formData();
    const fromAcc = parseInt(formData.get('fromAcc') as string);
    const recipientAddress = formData.get('recipientAddress') as string;
    const amount = parseInt(formData.get('amount') as string);
    const reference = formData.get('reference') as string;
    const description = formData.get('description') as string;

    let recipient;
    try {
        recipient = JSON.parse(recipientAddress);
    } catch (error) {
        return json({ success: false, error: 'Json parsing error!' }, { status: 400 });
    }

    const user = await getUserSession(context, request);
    const db = getPrismaClient(context);

    try {
        //TODO
        if (!fromAcc) {
            throw new Error('Must indicate the account to transfer from!');
        }

        const fromAccount = await db.account.findFirst({
            where: { acc: fromAcc },
        });

        if (!fromAccount) {
            throw new Error('Sender account not found');
        }

        const toAccount = await db.account.findFirst({
            where: {
                pay_id: recipient.payId,
            },
        });

        if (!toAccount) {
            throw new Error('Recipient account not found');
        }

        if (fromAcc == toAccount.acc) {
            throw new Error('Cannot transfer to the same account');
        }

        if (fromAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Right now, Cloudflare D1 aims for speed and eventual consistency rather than ACID-compliance, 
        // so it doesn't support transactions now, but when it does, this code will support it.
        const result = await db.$transaction([
            db.account.update({
                where: { acc: fromAccount.acc },
                data: { balance: { decrement: amount } },
            }),
            db.account.update({
                where: { acc: toAccount.acc },
                data: { balance: { increment: amount } },
            }),
            db.transaction.create({
                data: {
                    amount,
                    sender_uid: user!.uid,
                    recipient_uid: toAccount.uid,
                    reference: reference,
                    description,
                    timestamp: new Date(),
                    settled: true,
                    type: 'pay-someone',
                    recipient_address: recipientAddress,
                    sender: { connect: { acc: fromAccount.acc } },
                    recipient: { connect: { acc: toAccount.acc } },
                },
            }),
        ]);

        return json({ success: true, ...result });
    } catch (error) {
        console.error('Transfer error:', error);
        return json({ success: false, error: (error as Error).message }, { status: 400 });
    }
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
    const user = await getUserSession(context, request);
    const db = getPrismaClient(context);

    const [userAccounts] = await Promise.all([
        db.account.findMany({
            where: { uid: user!.uid },
        }),
    ]);

    if (!userAccounts) {
        throw new Response("No Accounts Found! This is a catastrophic error since accounts should have been created on sign-up :/", { status: 404 });
    }

    return json({
        userAccounts,
    });
};

const PaySomeone = () => {
    const actionData: any = useActionData();
    const { userAccounts: accounts } = useLoaderData<{ userAccounts: Account[] }>();
    const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState('-.--');
    const [recipientAddress, setRecipientAddress] = useState<{
        accountName: string,
        acc: number,
        bsb: number,
        payId: string,
        billerCode: number,
        crn: number,
    }>({
        accountName: '',
        acc: -1,
        bsb: -1,
        payId: '',
        billerCode: -1,
        crn: -1
    });

    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');

    const handleFromAccChange = (value: string | string[]) => {
        setFromAcc(parseInt(value as string));
    };

    const toDigits = (value: string): number => {
        value = value.replace(/[^0-9.]/g, '');
        return value ? parseInt(value) : 0;
    }

    const updateRecipientAddress = (key: string, value: string | number) => {
        setRecipientAddress(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('accountName', event.target.value);
    };

    const handleAccChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('acc', toDigits(event.target.value));
    };

    const handleBsbChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('bsb', toDigits(event.target.value));
    };

    const handlePayIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('payId', event.target.value);
    };

    const handleBillerCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('billerCode', toDigits(event.target.value));
    };

    const handleCrnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('crn', toDigits(event.target.value));
    };

    const handleReferenceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReference(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    return (

        <Page.Content>
            <Card shadow width="100%" style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
                <Form method="post">
                    <Text h4>Schedule</Text>
                    <Tabs initialValue="now" hideDivider>
                        <Tabs.Item label="Now" value="now" />
                        <Tabs.Item label="Later" value="later">
                            <Text>Later Ui here</Text>
                        </Tabs.Item>
                        <Tabs.Item label="Recurring" value="recurring">
                            <Text>Recurring Ui here</Text>
                        </Tabs.Item>
                    </Tabs>
                    <Text h4>From Account</Text>
                    <div style={{ width: '48%' }}>
                        <Select placeholder="Select account" width="100%" onChange={handleFromAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {// @ts-ignore
                                accounts.map((account: Account) => (
                                    <Select.Option key={account.acc} value={account.acc.toString()}>
                                        {account.short_description}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                    <input type="hidden" name="fromAcc" value={fromAcc || ''} />
                    <Tabs initialValue="acc-bsb" hideDivider style={{ marginTop: 20 }}>
                        <Tabs.Item label="ACC / BSB" value="acc-bsb">
                            <Text h4>Account Name</Text>
                            <Input width="100%" placeholder="Enter account name" aria-label="Account Name" value={recipientAddress.accountName} onChange={handleAccountNameChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            <Text h4 style={{ marginTop: 10 }}>Account Number</Text>
                            <Input width="100%" placeholder="Enter account number" aria-label="Account Number" value={recipientAddress.acc === -1 ? '' : recipientAddress.acc.toString()} onChange={handleAccChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            <Text h4 style={{ marginTop: 10 }}>BSB</Text>
                            <Input width="100%" placeholder="Enter bsb" aria-label="BSB" value={recipientAddress.bsb === -1 ? '' : recipientAddress.bsb.toString()} onChange={handleBsbChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="PayID" value="pay-id">
                            <Text h4>PayID</Text>
                            <Input width="100%" placeholder="Enter PayID" aria-label="PayID" onChange={handlePayIdChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="BPay" value="b-pay">
                            <Text h4>Biller Code</Text>
                            <Input width="100%" placeholder="Enter biller code" aria-label="Biller Code" value={recipientAddress.billerCode === -1 ? '' : recipientAddress.billerCode.toString()} onChange={handleBillerCodeChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            <Text h4 style={{ marginTop: 10 }}>CRN</Text>
                            <Input width="100%" placeholder="Enter CRN" aria-label="CRN" value={recipientAddress.crn === -1 ? '' : recipientAddress.crn.toString()} onChange={handleCrnChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </Tabs.Item>
                    </Tabs>
                    <input type="hidden" name="recipientAddress" value={JSON.stringify(recipientAddress)} />
                    <Text h4 style={{ marginTop: 10 }}>Amount</Text>
                    <CurrencyInput amount={amount} onAmountChange={function (amount: string) {
                        setAmount(amount);
                    }} />
                    <Text h4 style={{ marginTop: 10 }}>Reference</Text>
                    <Textarea width="100%" placeholder="Enter reference" aria-label="Reference" name="reference" value={reference} onChange={handleReferenceChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Text h4 style={{ marginTop: 10 }}>Description</Text>
                    <Textarea width="100%" placeholder="Enter description" aria-label="Description" name="description" value={description} onChange={handleDescriptionChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginTop: 20 }}>
                        <Button auto placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Cancel</Button>
                        <Button auto htmlType="submit" type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirm</Button>
                    </div>
                </Form>
                {actionData && (
                    <div style={{ marginTop: '20px' }}>
                        {actionData.success ? (
                            <Text type="success">Transfer successful!</Text>
                        ) : (
                            <Text type="error">Transfer failed: {actionData.error}</Text>
                        )}
                    </div>
                )}
            </Card>
        </Page.Content>
    );
};

export default PaySomeone;