import { Page } from '@geist-ui/react';
import { Account } from '@prisma/client';
import { ActionFunction, json, LoaderFunction } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setInTransactionFlow } from '~/appSlice';
import TransferBetweenAccountsForm from '~/components/TransferBetweenAccountsForm';
import { getPrismaClient } from '~/service/db.server';
import { TransactionService } from '~/service/transactionsService';
import { getUserSession } from "../auth.server";
export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
  try {
    const formData = await request.formData();
    const user = await getUserSession(context, request);

    if (!user) {
      return json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const transactionService = new TransactionService(getPrismaClient(context));

    const result = await transactionService.createTransaction({
      type: 'internal',
      fromAcc: parseInt(formData.get('fromAcc') as string),
      toAcc: parseInt(formData.get('toAcc') as string),
      amount: parseInt((formData.get('amount') as string).replace('.', '')),
      description: formData.get('description') as string,
      userId: user.uid
    });

    return json({ success: true, ...result });
  } catch (error) {
    return json({ success: false, error: (error as Error).message }, { status: 400 });
  }
};
export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  // fetch the user details and related data from Prisma
  const [userAccounts] = await Promise.all([
    db.account.findMany({
      where: { uid: user!.uid },
    }),
  ]);

  return json({
    userAccounts,
  });
};
export default function TransferBetweenAccounts() {
  const actionData: any = useActionData();
  const dispatch = useDispatch()
  const { userAccounts } = useLoaderData<{ userAccounts: Account[] }>();

  useEffect(() => {
    setTimeout(() => dispatch(setInTransactionFlow(!actionData || !actionData.success)), 1000);
  }, [actionData, dispatch]);

  return (
    <Page>
      <Page.Content>
        <TransferBetweenAccountsForm accounts={userAccounts as any as Account[]} actionData={actionData} />
      </Page.Content>
    </Page>
  );
}