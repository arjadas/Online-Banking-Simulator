import { Button, Card, Input, Modal, Select, Spacer, Tabs, Textarea } from '@geist-ui/core';
import { Account } from '@prisma/client';
import { Form, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import CurrencyInput from '~/components/CurrencyInput';
import { UserPrevContactResult } from '~/routes/app.paySomeone';
import ResizableText from './ResizableText';
import { TransactionTemporalTabs } from './TransactionTemporalTabs';
import { RecipientAddress } from '~/service/transactionsService';
import { blankTransactionFlow, setTransactionFlow, TransactionFlow } from '~/appSlice';
import { set } from 'date-fns';
import { useDispatch } from 'react-redux';

interface PaySomeoneFormProps {
    accounts: Account[];
    actionData: any;
    transactionFlow: TransactionFlow;
    onBack: () => void;
}

const PaySomeoneForm: React.FC<PaySomeoneFormProps> = ({ accounts, onBack, actionData, transactionFlow }) => {
    const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState('-.--');
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [addressTypeTab, setAddressTypeTab] = useState('acc-bsb');
    const [temporalTab, setTemporalTab] = useState('now');
    const dispatch = useDispatch();
    const blankRecipientAddress: RecipientAddress = {
        accountName: '',
        acc: -1,
        bsb: -1,
        payId: '',
        billerCode: -1,
        crn: -1
    }

    const navigate = useNavigate();
    const [recipientAddress, setRecipientAddress] = useState(blankRecipientAddress);

    const handleFromAccChange = (value: string | string[]) => {
        setFromAcc(parseInt(value as string));
    };

    const toDigits = (value: string): number => {
        value = value.replace(/[^0-9.]/g, '');
        return value ? parseInt(value) : 0;
    }

    useEffect(() => {
        if (transactionFlow.fromAccPaySomeone && !fromAcc) { setFromAcc(transactionFlow.fromAccPaySomeone) }

        if (transactionFlow.userPrevContact) {
            if (transactionFlow.userPrevContact.contact_recipient_address) {
                const parsedAddress = JSON.parse(transactionFlow.userPrevContact.contact_recipient_address) as Partial<RecipientAddress>;
                Object.entries(parsedAddress).forEach(([key, value]) => {
                    if (key in recipientAddress && recipientAddress[key as keyof RecipientAddress] === blankRecipientAddress[key as keyof RecipientAddress]) {
                        updateRecipientAddress(key as keyof RecipientAddress, value as any);
                    }
                });
            }
            setDescription(transactionFlow.userPrevContact.contact_description || '');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromAcc, transactionFlow]);

    const updateRecipientAddress = (key: keyof RecipientAddress, value: string | number) => {
        setRecipientAddress((prevState: any) => ({
            ...prevState,
            [key]: value,
        }));

        if (key === 'acc' || key === 'bsb' || key === 'accountName') {
            setAddressTypeTab('acc-bsb');
        } else if (key === 'payId') {
            setAddressTypeTab('pay-id');
        } else if (key === 'billerCode' || key === 'crn') {
            setAddressTypeTab('b-pay');
        }
    };

    const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('accountName', event.target.value);
    };

    const goHome = () => {
        dispatch(setTransactionFlow(blankTransactionFlow));
        navigate('/app/home')
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
        <Form method="post">
            <div style={{ display: 'flex', gap: '20px', maxWidth: 1200, margin: '0 auto' }}>
                <Card shadow width="50%" style={{ padding: 20 }}>
                    <TransactionTemporalTabs onTemporalTabsChange={(value: string) => setTemporalTab(value)} />
                    <ResizableText h4>From Account</ResizableText>
                    <div style={{ width: '100%' }}>
                        <Select placeholder="Select account" width="100%" value={fromAcc?.toString()} onChange={handleFromAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {accounts.map((account: Account) => (
                                <Select.Option key={account.acc} value={account.acc.toString()}>
                                    {account.short_description}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <Spacer h={1.5} />
                    <ResizableText h4>Amount</ResizableText>
                    <CurrencyInput amount={amount} onAmountChange={function (amount: string) {
                        setAmount(amount);
                    }} />
                    <Spacer h={1.5} />
                    <ResizableText h4>Reference</ResizableText>
                    <ResizableText small>For your reference only.</ResizableText>
                    <Spacer h={0.5} />
                    <Textarea width="100%" placeholder="Enter reference" aria-label="Reference" name="reference" value={reference} onChange={handleReferenceChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <input type="hidden" name="temporalTab" value={temporalTab} />
                    <input type="hidden" name="recipientAddress" value={JSON.stringify(recipientAddress)} />
                    <input type="hidden" name="fromAcc" value={fromAcc} />
                </Card>

                <Card shadow width="50%" style={{ padding: 20 }}>
                    <ResizableText h4>Payment Method</ResizableText>
                    <Tabs style={{ fontWeight: '600' }} value={addressTypeTab} onChange={setAddressTypeTab} hideDivider>
                        <Tabs.Item label="ACC / BSB" value="acc-bsb">
                            <ResizableText small>Traditional payment method</ResizableText>
                            <Spacer h={1} />
                            <ResizableText h4>Account Name</ResizableText>
                            <Input width="100%" placeholder="Enter account name" aria-label="Account Name" value={recipientAddress.accountName} onChange={handleAccountNameChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <Spacer h={1} />
                            <ResizableText h4>Account Number</ResizableText>
                            <Input width="100%" placeholder="Enter account number" aria-label="Account Number" value={recipientAddress.acc === -1 ? '' : recipientAddress.acc.toString()} onChange={handleAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <Spacer h={1} />
                            <ResizableText h4>BSB</ResizableText>
                            <Input width="100%" placeholder="Enter bsb" aria-label="BSB" value={recipientAddress.bsb === -1 ? '' : recipientAddress.bsb.toString()} onChange={handleBsbChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="PayID" value="pay-id">
                            <ResizableText small>Payments using the recipient&apos;s email or mobile number.</ResizableText>
                            <Spacer h={1} />
                            <ResizableText h4>PayID</ResizableText>
                            <Input width="100%" placeholder="Enter PayID" aria-label="PayID" value={recipientAddress.payId} onChange={handlePayIdChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="BPay" value="b-pay">
                            <ResizableText small >For bills, rent, tax, etc.</ResizableText>
                            <Spacer h={1} />
                            <ResizableText h4>Biller Code</ResizableText>
                            <Input width="100%" placeholder="Enter biller code" aria-label="Biller Code" value={recipientAddress.billerCode === -1 ? '' : recipientAddress.billerCode.toString()} onChange={handleBillerCodeChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <Spacer h={1} />
                            <ResizableText h4>CRN</ResizableText>
                            <Input width="100%" placeholder="Enter CRN" aria-label="CRN" value={recipientAddress.crn === -1 ? '' : recipientAddress.crn.toString()} onChange={handleCrnChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                    </Tabs>
                    <Spacer h={1.2} />
                    <ResizableText h4>Description</ResizableText>
                    <ResizableText small>Shown to recipient.</ResizableText>
                    <Spacer h={0.5} />
                    <Textarea width="100%" placeholder="Enter description" aria-label="Description" name="description" value={description} onChange={handleDescriptionChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Spacer h={1.5} />
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end' }}>
                        <Button auto onClick={onBack} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Back</Button>
                        <Button auto htmlType="submit" type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirm</Button>
                    </div>
                    {actionData && !actionData.success && (
                        <div style={{ marginTop: '20px' }}>
                            <ResizableText type="error">Transfer failed: {actionData.error}</ResizableText>
                        </div>
                    )}
                </Card>


                <Modal width={1.5} visible={actionData && actionData.success} onClose={goHome}>
                    <Modal.Title>
                        <Spacer />
                        {temporalTab === 'now' ? 'Payment Successful!' : 'Payment Scheduled Successfully!'}
                    </Modal.Title>
                    <Modal.Content>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ color: '#0cc92c', fontSize: '64px', marginBottom: '5px' }}>✓</div>
                            <div style={{ margin: '10px 0' }}>
                                <ResizableText>From: {accounts.find(acc => acc.acc === fromAcc)?.short_description}</ResizableText>
                                {addressTypeTab === 'acc-bsb' && (
                                    <>
                                        <ResizableText>To: {recipientAddress.accountName}</ResizableText>
                                        <ResizableText>BSB: {recipientAddress.bsb}</ResizableText>
                                        <ResizableText>Account: {recipientAddress.acc}</ResizableText>
                                    </>
                                )}
                                {addressTypeTab === 'pay-id' && (
                                    <ResizableText>To PayID: {recipientAddress.payId}</ResizableText>
                                )}
                                {addressTypeTab === 'b-pay' && (
                                    <>
                                        <ResizableText>Biller Code: {recipientAddress.billerCode}</ResizableText>
                                        <ResizableText>CRN: {recipientAddress.crn}</ResizableText>
                                    </>
                                )}
                                <ResizableText>Amount: ${amount}</ResizableText>
                                <ResizableText>Frequency: {temporalTab === 'now' ? 'One-time payment' : 'Scheduled payment'}</ResizableText>
                                {reference && <ResizableText>Reference: {reference}</ResizableText>}
                                {description && <ResizableText>Description: {description}</ResizableText>}
                            </div>
                        </div>
                    </Modal.Content>
                    <Modal.Action onClick={goHome} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>Go home</Modal.Action>
                </Modal>
            </div>
        </Form>
    );
}

export default PaySomeoneForm;