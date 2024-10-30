import { Button, Card, Input, Modal, Select, Spacer } from '@geist-ui/core';
import { Account } from '@prisma/client';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import React, { useState } from 'react';
import CurrencyInput from '~/components/CurrencyInput';
import ResizableText from './ResizableText';
import { TransactionTemporalTabs } from './TransactionTemporalTabs';

interface TransferBetweenAccountsFormProps {
    accounts: Account[];
    actionData: any;
}

const TransferBetweenAccountsForm: React.FC<TransferBetweenAccountsFormProps> = ({ accounts, actionData }) => {
    const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
    const [toAcc, setToAcc] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState('-.--');
    const [description, setDescription] = useState('');
    const [temporalTab, setTemporalTab] = useState('now');
    const navigate = useNavigate();

    const handleFromAccChange = (value: string | string[]) => {
        setFromAcc(parseInt(value as string));
    };

    const handleToAccChange = (value: string | string[]) => {
        setToAcc(parseInt(value as string));
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const goHome = () => {
        navigate('/app/home')
    };

    return (
        <Card shadow width="100%" style={{ maxWidth: '720px', margin: '0 auto' }} padding={1}>
            <ResizableText h2 style={{ marginBottom: '20px' }}>Transfer Between Accounts</ResizableText>
            <Form method="post">
                <TransactionTemporalTabs onTemporalTabsChange={(value: string) => setTemporalTab(value)} />
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
                <CurrencyInput onAmountChange={function (amount: string) {
                    setAmount(amount);
                }} amount={amount} />
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
                <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginTop: 20 }}>
                    <Button auto placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={goHome}>Back</Button>
                    <Button auto htmlType="submit" type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirm</Button>
                </div>
                <input type="hidden" name="temporalTab" value={temporalTab} />
            </Form>
            <Modal visible={actionData && actionData.success} onClose={goHome}>
                <Modal.Title>Transfer Successful!</Modal.Title>
                <Modal.Action onClick={goHome} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>Go Home</Modal.Action>
            </Modal>
            {actionData && (
                <div style={{ marginTop: '20px' }}>
                    {!actionData.success && (
                        <ResizableText type="error">Transfer failed: {actionData.error}</ResizableText>
                    )}
                </div>
            )}
        </Card>
    );
};

export default TransferBetweenAccountsForm;