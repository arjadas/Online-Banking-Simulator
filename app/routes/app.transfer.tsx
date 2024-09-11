import React, { useState } from 'react';
import { GeistProvider, CssBaseline, Page, Text, Card, Select, Input, Button, Spacer } from '@geist-ui/react';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { db } from "../util/db.server";
import { requireUserSession } from "../auth.server";
import { Account, TransactionType } from '@prisma/client';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const fromAcc = parseInt(formData.get('fromAcc') as string);
  const toAcc = parseInt(formData.get('toAcc') as string);
  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string;

  // Fetch the user session
  const user = await requireUserSession(request);

  try {
    // Start a transaction
    const result = await db.$transaction(async (prisma) => {
      // Fetch the accounts
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

      // Update account balances
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

      return { fromAcc, toAcc, newTransaction };
    });

    return json({ success: true, ...result });
  } catch (error) {
    console.error('Transfer error:', error);
    return json({ success: false, error: (error as Error).message }, { status: 400 });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // Ensure the user is authenticated
  const user = await requireUserSession(request);

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

const TransferBetweenAccounts = () => {
  const actionData: any = useActionData();
  const { userAccounts: accounts } = useLoaderData<{ userAccounts: Account[] }>();
  const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
  const [toAcc, setToAcc] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const handleFromAccChange = (value: string | string[]) => {
    setFromAcc(parseInt(value as string));
  };

  const handleToAccChange = (value: string | string[]) => {
    setToAcc(parseInt(value as string));
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

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Page>
      <Page.Header>
        <Text h1 style={{ marginBottom: '20px' }}>Transfer Between Accounts</Text>
      </Page.Header>
      <Page.Content>
        <Card shadow width="100%" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Form method="post">
            <Text h3>Choose Accounts</Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: '48%' }}>
                <Text small>From</Text>
                <Select
                  placeholder="Select account"
                  width="100%"
                  onChange={handleFromAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                  {accounts.map((account) => (
                    <Select.Option key={account.acc} value={account.acc.toString()}>
                      {account.short_description}
                    </Select.Option>
                  ))}
                </Select>
                <input type="hidden" name="fromAcc" value={fromAcc || ''} />
              </div>
              <div style={{ width: '48%' }}>
                <Text small>To</Text>
                <Select
                  placeholder="Select account"
                  width="100%"
                  onChange={handleToAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                  {accounts.map((account) => (
                    <Select.Option key={account.acc} value={account.acc.toString()}>
                      {account.short_description}
                    </Select.Option>
                  ))}
                </Select>
                <input type="hidden" name="toAcc" value={toAcc || ''} />
              </div>
            </div>
            <Spacer h={1} />
            <Text h3>Transfer Amount</Text>
            <Input
              clearable
              placeholder="Enter amount"
              width="100%"
              value={amount.toFixed(2)}
              onChange={handleAmountChange}
              name="amount" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
            <Spacer h={1} />
            <Input
              clearable
              placeholder="Enter description"
              width="100%"
              value={description}
              onChange={handleDescriptionChange}
              name="description" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
            <Spacer h={1} />
            <Button type="secondary" htmlType="submit" width="100%" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Transfer</Button>
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
    </Page>
  );
};

export default TransferBetweenAccounts;
