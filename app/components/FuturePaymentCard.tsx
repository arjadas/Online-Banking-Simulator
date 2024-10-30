import React from 'react';
import { Card, Grid, Badge } from '@geist-ui/react';
import { RecurringTransactionWithRecipient } from '~/routes/app.upcoming';
import { GeneratedTransaction } from '~/util/futureTransactionUtil';
import ResizableText from './ResizableText';
import { formatDate, getBadgeColor, toFixedWithCommas } from '~/util/util';
import { frequencyObjectToString } from './ReccuringTransactionModal';
import { getTransactionIcon } from '~/util/util.tsx';
import { RecurringTransaction } from '@prisma/client';

interface RecurringTransactionCardProps {
    transaction: RecurringTransactionWithRecipient | GeneratedTransaction;
    userAccountIds: number[];
}

function isGeneratedTransaction(value: any): value is GeneratedTransaction {
    return value && 'generatedDate' in value && 'transaction' in value;
}

export const RecurringTransactionCard: React.FC<RecurringTransactionCardProps> = ({ transaction, userAccountIds }) => {
    const generatedTransaction = isGeneratedTransaction(transaction)
    const mTransaction = generatedTransaction ? (transaction as GeneratedTransaction).transaction as RecurringTransactionWithRecipient: transaction;
    const oneOffPayment = mTransaction.starts_on == mTransaction.ends_on;
    const isExternalSender = !userAccountIds.includes(mTransaction.sender_acc);
    const isExternalRecipient = !userAccountIds.includes(mTransaction.recipient_acc);
    const senderDisplayName = isExternalSender ? 'External Account' : mTransaction.sender.short_description;
    const recipientDisplayName = isExternalRecipient ? 'External Account' : mTransaction.recipient.short_description;

    return (
        <Card margin={1} key={mTransaction.recc_transaction_id} shadow style={{ marginBottom: '1rem' }}>
            <Grid.Container gap={2}>
                <Grid xs={3} alignItems="center" justify="center">
                    {getTransactionIcon(userAccountIds, mTransaction.recipient_acc)}
                </Grid>
                <Grid xs={21} alignItems="center">
                    <Grid.Container gap={1}>
                        <Grid xs={24}>
                            <ResizableText h4 style={{ margin: 0 }}>${toFixedWithCommas(mTransaction.amount / 100, 2)}</ResizableText>
                        </Grid>
                        <Grid xs={24}>
                            <ResizableText small>
                                From: <Badge type="secondary" style={{ backgroundColor: getBadgeColor(mTransaction.sender.short_description, isExternalSender) }}>
                                    {isExternalSender ? senderDisplayName : mTransaction.sender.short_description}
                                </Badge>
                                &nbsp;To: <Badge type="secondary" style={{ backgroundColor: getBadgeColor(mTransaction.recipient.short_description, isExternalRecipient) }}>
                                    {isExternalRecipient ? recipientDisplayName : mTransaction.recipient.short_description}
                                </Badge>
                            </ResizableText>
                        </Grid>
                        {(!oneOffPayment && !generatedTransaction) &&<Grid xs={24}>
                            <ResizableText small>Frequency: {frequencyObjectToString(JSON.parse(mTransaction.frequency))}</ResizableText>
                        </Grid>}
                        {(oneOffPayment) ? (<Grid xs={24}>
                            <ResizableText small>Date: {formatDate(new Date(mTransaction.starts_on))}</ResizableText>
                        </Grid>) : (
                            <>
                                {(generatedTransaction && !oneOffPayment) && <Grid xs={24}>
                                <ResizableText small>Date: {formatDate(new Date(transaction.generatedDate))}</ResizableText>
                                </Grid>}
                                {(!generatedTransaction && !oneOffPayment) && <Grid xs={24}>
                                    <ResizableText small>
                                        {new Date(mTransaction.starts_on) <= new Date() ? 'Started on:' : 'Starts on:'} {formatDate(new Date(mTransaction.starts_on))}
                                    </ResizableText>
                                </Grid>}
                                {(!generatedTransaction && !oneOffPayment) && <Grid xs={24}>
                                    <ResizableText small>
                                        {mTransaction.ends_on
                                            ? `Ends on: ${formatDate(new Date(mTransaction.ends_on))}`
                                            : "Continues indefinitely"}
                                    </ResizableText>
                                </Grid>}
                            </>
                        )}
                    </Grid.Container>
                </Grid>
            </Grid.Container>
        </Card>
    );
};