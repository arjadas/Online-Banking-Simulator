import { Select, Tabs } from '@geist-ui/core';
import { Button, Input, Page, Text, Textarea } from '@geist-ui/react';
import { PrismaD1 } from '@prisma/adapter-d1';
import { ActionFunction, LoaderFunction, json } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import { requireUserSession } from '../auth.server';
import { getPrismaClient } from '~/util/db.server';
import "../styles/app.paySomeone.css";
import { Account } from '@prisma/client';
import ResizableText from '~/components/ResizableText';

export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
    const formData = await request.formData();
    const fromAcc = parseInt(formData.get('fromAcc') as string);
    const recipientAddress = formData.get('recipientAddress') as string;
    const amount = parseInt(formData.get('amount') as string);
    const reference = formData.get('reference') as string;
    const description = formData.get('description') as string;
    //adendiamond1@gmail.com
    // parse the recipientAddress JSON string
    let recipient;
    try {
        recipient = JSON.parse(recipientAddress);
    } catch (error) {
        return json({ success: false, error: 'Json parsing error!' }, { status: 400 });
    }

    const user = await requireUserSession(request);
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    const db = getPrismaClient(context);

    try {
        const result = await db.$transaction(async (prisma) => {
            console.log('fa', fromAcc)
            // fetch the sender account
            const fromAccount = await prisma.account.findFirst({
                where: { acc: fromAcc },
            });

            if (!fromAccount) {
                throw new Error('Sender account not found');
            }

            // fetch the recipient account based on recipient data
            const toAccount = await prisma.account.findFirst({
                where: {
                    pay_id: recipient.payId

                },
            });

            if (!toAccount) {
                throw new Error('Recipient account not found');
            }

            if (fromAcc == toAccount.acc) {
                throw new Error('Cannot transfer to the same account');
            }

            console.log(fromAccount.balance, amount)
            if (fromAccount.balance < amount) {
                throw new Error('Insufficient funds');
            }

            // Update the account balances
            await prisma.account.update({
                where: { acc: fromAccount.acc },
                data: { balance: { decrement: amount } },
            });

            await prisma.account.update({
                where: { acc: toAccount.acc },
                data: { balance: { increment: amount } },
            });

            // Create a new transaction
            const newTransaction = await prisma.transaction.create({
                data: {
                    amount,
                    sender_uid: user.uid,
                    recipient_uid: 'nah',
                    reference: reference,
                    description,
                    timestamp: new Date(),
                    settled: true,
                    type: 'pay-someone',
                    recipient_address: recipientAddress,
                    sender: { connect: { acc: fromAccount.acc } },
                    recipient: { connect: { acc: toAccount.acc } }
                },
            });

            return { fromAcc, toAcc: toAccount.acc, newTransaction };
        });

        return json({ success: true, ...result });
    } catch (error) {
        console.error('Transfer error:', error);
        return json({ success: false, error: (error as Error).message }, { status: 400 });
    }
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
    // Ensure the user is authenticated
    const user = await requireUserSession(request);
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    const db = getPrismaClient(context);

    // Fetch the user details and related data from Prisma
    const [userAccounts] = await Promise.all([
        db.account.findMany({
            where: { uid: user.uid },
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
    const [amount, setAmount] = useState(0);
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

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value;
        inputValue = inputValue.replace(/[^0-9.]/g, '');
        //TODO fix this

        // Ensure only one decimal point is allowed
        const parts = inputValue.split('.');
        if (parts.length > 2) {
            inputValue = parts[0] + '.' + parts.slice(1).join('');
        }

        // Format the number to 2 decimal places
        if (inputValue) {
            const amount = parseInt(inputValue.replace('.', ''))
            setAmount(amount);
        } else {
            setAmount(0);
        }
    };

    const toDigits = (value: string): number => {
        value = value.replace(/[^0-9.]/g, '');
        if (value) {
            return parseInt(value);
        } else {
            return 0;
        }
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

    const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReference(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    return (
        <Page className="pagepay">
            <Page.Header>
                <ResizableText h1 style={{ marginBottom: 20 }}>Transaction Form</ResizableText>
            </Page.Header>
            <Page.Content >
                {/* <Card shadow width="100%" style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}> */}
                <Form method="post">
                    <ResizableText h4>Schedule</ResizableText>
                    <Tabs initialValue="now" hideDivider>
                        <Tabs.Item label="Now" value="now" />
                        <Tabs.Item label="Later" value="later">
                            <div>
                                <div className="amount">
                                    <input type="number" name="amount" placeholder="Amount" required />
                                </div>
                                <div className='desc'>
                                    <Textarea width="100%" placeholder="Enter description" aria-label="Description" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <div className='date'>
                                    <input type="date" name="payment-date" placeholder="Payment Date" required />
                                </div>
                            </div>
                        </Tabs.Item>
                        <Tabs.Item label="Recurring" value="recurring">
                            <ResizableText>Recurring Ui here</ResizableText>
                        </Tabs.Item>
                    </Tabs>

                    <div className='temp'>
                        <ResizableText h4>From Account</ResizableText>
                        <div style={{ width: '48%' }}>
                            <Select placeholder="Select account" width="100%" onChange={handleFromAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                {// @ts-ignore
                                    accounts.map((account: Account) => (
                                        <Select.Option key={account.acc} value={account.acc.toString()}>
                                            {account.short_description}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </div>
                    </div>
                    <input type="hidden" name="fromAcc" value={fromAcc || ''} />
                    <Tabs initialValue="acc-bsb" hideDivider style={{ marginTop: 20 }}>
                        <Tabs.Item label="ACC / BSB" value="acc-bsb">
                            <ResizableText h4>Account Name</ResizableText>
                            <Input width="100%" placeholder="Enter account name" aria-label="Account Name" value={recipientAddress.accountName} onChange={handleAccountNameChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <ResizableText h4 style={{ marginTop: 10 }}>Account Number</ResizableText>
                            <Input
                                width="100%"
                                placeholder="Enter account number"
                                aria-label="Account Number"
                                value={recipientAddress.acc == -1 ? '' : recipientAddress.acc.toString()}
                                onChange={handleAccChange}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <ResizableText h4 style={{ marginTop: 10 }}>BSB</ResizableText>
                            <Input
                                width="100%"
                                placeholder="Enter bsb"
                                aria-label="BSB"
                                value={recipientAddress.bsb == -1 ? '' : recipientAddress.bsb.toString()}
                                onChange={handleBsbChange}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="PayID" value="pay-id">
                            <ResizableText h4>PayID</ResizableText>
                            <Input width="100%" placeholder="Enter PayID" aria-label="PayID" onChange={handlePayIdChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="BPay" value="b-pay">
                            <ResizableText h4>Biller Code</ResizableText>
                            <Input
                                width="100%"
                                placeholder="Enter biller code"
                                aria-label="Biller Code"
                                value={recipientAddress.billerCode == -1 ? '' : recipientAddress.billerCode.toString()}
                                onChange={handleBillerCodeChange}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <ResizableText h4 style={{ marginTop: 10 }}>CRN</ResizableText>
                            <Input
                                width="100%"
                                placeholder="Enter CRN"
                                aria-label="CRN"
                                value={recipientAddress.crn == -1 ? '' : recipientAddress.crn.toString()}
                                onChange={handleCrnChange}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                    </Tabs>
                    <input className="PaySomeone-Box" type="hidden" name="recipientAddress" value={JSON.stringify(recipientAddress)} />
                    <ResizableText h4 style={{ marginTop: 10 }}>Amount</ResizableText>
                    <Input className="PaySomeone-Box" width="100%" placeholder="Enter amount" aria-label="Amount" name="amount" value={amount.toFixed(2)} onChange={handleAmountChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                    <ResizableText h4 style={{ marginTop: 10 }}>Reference</ResizableText>
                    <Textarea width="100%" placeholder="Enter reference" aria-label="Reference" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <ResizableText h4 style={{ marginTop: 10 }}>Description</ResizableText>
                    <Textarea width="100%" placeholder="Enter description" aria-label="Description" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <div style={{
                        display: 'flex',
                        gap: 20,
                        justifyContent: 'flex-end',
                        marginTop: 20
                    }}>
                        <Button auto placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Cancel</Button>
                        <Button auto htmlType="submit" type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirm</Button>
                    </div>
                </Form>
                {actionData && (
                    <div style={{ marginTop: '20px' }}>
                        {actionData.success ? (
                            <ResizableText type="success">Transfer successful!</ResizableText>
                        ) : (
                            <ResizableText type="error">Transfer failed: {actionData.error}</ResizableText>
                        )}
                    </div>
                )}
                {/*  </Card> */}

            </Page.Content>
        </Page>
    );
};

export default PaySomeone;