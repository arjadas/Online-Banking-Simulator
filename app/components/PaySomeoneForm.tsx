import React, { useEffect, useState } from 'react';
import { Card, Select, Tabs, Button, Input, Text, Textarea } from '@geist-ui/core';
import { Form, useActionData } from '@remix-run/react';
import CurrencyInput from '~/components/CurrencyInput';
import { Account, UserPrevContact } from '@prisma/client';
import { UserPrevContactResult } from '~/routes/app.paySomeone';

interface PaySomeoneFormProps {
    accounts: Account[];
    userPrevContact?: UserPrevContactResult | null
    onBack: () => void;
}

const PaySomeoneForm: React.FC<PaySomeoneFormProps> = ({ accounts, userPrevContact, onBack }) => {
    const actionData: any = useActionData();
    const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState('-.--');
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
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

    useEffect(() => {
        if (userPrevContact) {
            const contact_user = (userPrevContact?.contact_user ?? userPrevContact?.contact_mock_user)
            
            //TODO by
            setRecipientAddress(prevState => ({
                ...prevState,
                accountName: userPrevContact.,
                acc: userPrevContact.contact_acc,
                bsb: userPrevContact.
            }));

            setDescription(userPrevContact.contact_description || '');
        }
    }, [userPrevContact]);

    return (
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
                    <Button auto placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={onBack} >Back</Button>
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
    );
};

export default PaySomeoneForm;