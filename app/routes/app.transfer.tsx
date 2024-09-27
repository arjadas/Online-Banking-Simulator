import { Button, Card, Input, Page, Select, Spacer, Text } from '@geist-ui/react';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Account } from '@prisma/client';
import { ActionFunction, json, LoaderFunction } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import { requireUserSession } from "../auth.server";
import { getPrismaClient } from '~/util/db.server';
import ResizableText from '~/components/ResizableText';

export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
  const formData = await request.formData();
  const fromAcc = parseInt(formData.get('fromAcc') as string);
  const toAcc = parseInt(formData.get('toAcc') as string);
  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string;
  const user = await requireUserSession(request);
  const adapter = new PrismaD1(context.cloudflare.env.DB);
  const db = getPrismaClient(context);

  try {
    const result = await db.$transaction(async (prisma) => {
      const fromAccount = await prisma.account.findFirst({
        where: { acc: fromAcc },
      });

      const toAccount = await prisma.account.findFirst({
        where: { acc: toAcc },
      });

      if (!fromAccount || !toAccount) {
        throw new Error('One or both accounts not found');
      }

      if (fromAcc == toAcc) {
        throw new Error('Cannot transfer into same account.');
      }

      if (fromAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }

      // update account balances
      await prisma.account.update({
        where: { acc: fromAccount.acc },
        data: { balance: { decrement: amount } },
      });

      await prisma.account.update({
        where: { acc: toAccount.acc },
        data: { balance: { increment: amount } },
      });

      // create a new transaction
      /*const newTransaction = await prisma.transaction.create({
        data: {
          amount,
          sender_acc: fromAccount.acc,
          recipient_acc: toAccount.acc,
          sender_uid: user.uid,
          recipient_uid: user.uid,
          reference: `Transfer from ${fromAccount.short_description} to ${toAccount.short_description}`,
          description: description,
          timestamp: new Date(),
          settled: true,
          type: TransactionType.transfer,
        },
      });

      return { fromAcc, toAcc, newTransaction };*/
    });

    //   return json({ success: true, ...result });
  } catch (error) {
    console.error('Transfer error:', error);
    return json({ success: false, error: (error as Error).message }, { status: 400 });
  }
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await requireUserSession(request);
  const adapter = new PrismaD1(context.cloudflare.env.DB);
  const db = getPrismaClient(context);

  // fetch the user details and related data from Prisma
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

const TransferBetweenAccounts = () => {
  const actionData: any = useActionData();
  const { userAccounts: accounts } = useLoaderData<{ userAccounts: Account[] }>();
  const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
  const [toAcc, setToAcc] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleFromAccChange = (value: string | string[]) => {
    setFromAcc(parseInt(value as string));
  };

  const handleToAccChange = (value: string | string[]) => {
    setToAcc(parseInt(value as string));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    // Remove any non-numeric characters except for the decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Ensure there's only one decimal point
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Handle decimals and prevent multiple trailing zeros
    if (parts.length === 2 && parts[1].length > 2) {
      inputValue = parts[0] + '.' + parts[1].slice(0, 2);  // Limit to two decimal places
    }

    // Update the amount state with the properly formatted input
    setAmount(inputValue);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Page>
      <Page.Content>
        <Card shadow width="100%" style={{ maxWidth: '720px', margin: '0 auto' }} padding={1}>
        <ResizableText h2 style={{ marginBottom: '20px' }}>Transfer Between Accounts</ResizableText>
          <Form method="post">
            <ResizableText h3>Choose Accounts</ResizableText>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: '48%' }}>
                <ResizableText small>From</ResizableText>
                <Select
                  placeholder="Select account"
                  width="100%"
                  onChange={handleFromAccChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {// @ts-ignore
                    accounts.map((account: Account) => (
                      <Select.Option key={account.acc} value={account.acc.toString()}>
                        {account.short_description}
                      </Select.Option>
                    ))}
                </Select>
                <input type="hidden" name="fromAcc" value={fromAcc || ''} />
              </div>
              <div style={{ width: '48%' }}>
                <ResizableText small>To</ResizableText>
                <Select
                  placeholder="Select account"
                  width="100%"
                  onChange={handleToAccChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {// @ts-ignore
                    accounts.map((account: Account) => (
                      <Select.Option key={account.acc} value={account.acc.toString()}>
                        {account.short_description}
                      </Select.Option>
                    ))}
                </Select>
                <input type="hidden" name="toAcc" value={toAcc || ''} />
              </div>
            </div>
            <Spacer h={1} />
            <ResizableText h3>Transfer Amount</ResizableText>
            <Input
              clearable
              placeholder="Enter amount"
              width="100%"
              value={amount}
              onChange={handleAmountChange}
              name="amount"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Spacer h={1} />
            <Input
              clearable
              placeholder="Enter description"
              width="100%"
              value={description}
              onChange={handleDescriptionChange}
              name="description"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Spacer h={1} />
            <Button
              type="secondary"
              htmlType="submit"
              width="100%"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Transfer
            </Button>
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
        </Card>
      </Page.Content>
    </Page>
  );
};

export default TransferBetweenAccounts;