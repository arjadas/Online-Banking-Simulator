import { Button, Card, Input, Modal, Select, Spacer, Tabs, Textarea } from '@geist-ui/core';
import { Account } from '@prisma/client';
import { Form, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blankTransactionFlow, setTransactionFlow, setFromAcc, setRecipientAddress, blankRecipientAddress, setUserPrevContact } from '../appSlice';
import CurrencyInput from '../components/CurrencyInput';
import { RecipientAddress } from '../service/transactionsService';
import ResizableText from './ResizableText';
import { TransactionTemporalTabs } from './TransactionTemporalTabs';
import { RootState } from '../store';

interface PaySomeoneFormProps {
    accounts: Account[];
    actionData: any;
    onBack: () => void;
}

const PaySomeoneForm: React.FC<PaySomeoneFormProps> = ({ accounts, onBack, actionData }) => {
    const { transactionFlow } = useSelector((state: RootState) => state.app);
    const [amount, setAmount] = useState('-.--');
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [addressTypeTab, setAddressTypeTab] = useState('acc-bsb');
    const [temporalTab, setTemporalTab] = useState('now');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFromAccChange = (value: string | string[]) => {
        dispatch(setFromAcc(parseInt(value as string)));
    };

    const toDigits = (value: string): number => {
        value = value.replace(/[^0-9.]/g, '');
        return value ? parseInt(value) : 0;
    }

    useEffect(() => {
        if (transactionFlow.userPrevContact) {
            if (transactionFlow.userPrevContact.contact_recipient_address) {
                const partialRecipientAddress = JSON.parse(transactionFlow.userPrevContact.contact_recipient_address)
                const partialRecipientAddressKeys = Object.keys(partialRecipientAddress);
                const recipientAddress: RecipientAddress = {
                    ...blankRecipientAddress,
                    ...partialRecipientAddress,
                };

                if (partialRecipientAddressKeys.includes('acc') || partialRecipientAddressKeys.includes('bsb') || partialRecipientAddressKeys.includes('accountName')) {
                    setAddressTypeTab('acc-bsb');
                } else if (partialRecipientAddressKeys.includes('payId')) {
                    setAddressTypeTab('pay-id');
                } else if (partialRecipientAddressKeys.includes('billerCode') || partialRecipientAddressKeys.includes('crn')) {
                    setAddressTypeTab('b-pay');
                }

                if (JSON.stringify(recipientAddress) !== JSON.stringify(transactionFlow.recipientAddress)) {
                    setTimeout(() => { 
                        dispatch(setUserPrevContact(null)); 
                        dispatch(setRecipientAddress(recipientAddress));
              
                    }, 10);
                }
            }

            setDescription(transactionFlow.userPrevContact.contact_description || '');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionFlow.userPrevContact]);

    const updateRecipientAddress = (key: string, value: string | number) => {
        const recipientAddress: RecipientAddress = {
            ...transactionFlow.recipientAddress,
            [key]: value
        };

        dispatch(setRecipientAddress(recipientAddress));
    };

    const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecipientAddress('accountName', event.target.value);
    };

    const goHome = () => {
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
                        <Select placeholder="Select account" width="100%" value={transactionFlow.fromAcc?.toString()} onChange={handleFromAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    <input type="hidden" name="recipientAddress" value={JSON.stringify(transactionFlow.recipientAddress)} />
                    <input type="hidden" name="fromAcc" value={transactionFlow.fromAcc ?? ''} />
                </Card>

                <Card shadow width="50%" style={{ padding: 20 }}>
                    <ResizableText h4>Payment Method</ResizableText>
                    <Tabs style={{ fontWeight: '600' }} value={addressTypeTab} onChange={setAddressTypeTab} hideDivider>
                        <Tabs.Item label="ACC / BSB" value="acc-bsb">
                            <ResizableText small>Traditional payment method</ResizableText>
                            <Spacer h={1} />
                            <ResizableText h4>Account Name</ResizableText>
                            <Input width="100%" placeholder="Enter account name" aria-label="Account Name" value={transactionFlow.recipientAddress.accountName} onChange={handleAccountNameChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <Spacer h={1} />
                            <ResizableText h4>Account Number</ResizableText>
                            <Input width="100%" placeholder="Enter account number" aria-label="Account Number" value={transactionFlow.recipientAddress.acc === -1 ? '' : transactionFlow.recipientAddress.acc.toString()} onChange={handleAccChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <Spacer h={1} />
                            <ResizableText h4>BSB</ResizableText>
                            <Input width="100%" placeholder="Enter bsb" aria-label="BSB" value={transactionFlow.recipientAddress.bsb === -1 ? '' : transactionFlow.recipientAddress.bsb.toString()} onChange={handleBsbChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="PayID" value="pay-id">
                            <ResizableText small>Payments using the recipient&apos;s email or mobile number.</ResizableText>
                            <Spacer h={1} />
                            <ResizableText h4>PayID</ResizableText>
                            <Input width="100%" placeholder="Enter PayID" aria-label="PayID" value={transactionFlow.recipientAddress.payId} onChange={handlePayIdChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </Tabs.Item>
                        <Tabs.Item label="BPay" value="b-pay">
                            <ResizableText small >For bills, rent, tax, etc.</ResizableText>
                            <Spacer h={1} />
                            <ResizableText h4>Biller Code</ResizableText>
                            <Input width="100%" placeholder="Enter biller code" aria-label="Biller Code" value={transactionFlow.recipientAddress.billerCode === -1 ? '' : transactionFlow.recipientAddress.billerCode.toString()} onChange={handleBillerCodeChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                            <Spacer h={1} />
                            <ResizableText h4>CRN</ResizableText>
                            <Input width="100%" placeholder="Enter CRN" aria-label="CRN" value={transactionFlow.recipientAddress.crn === -1 ? '' : transactionFlow.recipientAddress.crn.toString()} onChange={handleCrnChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
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
                                <ResizableText>From: {accounts.find(acc => acc.acc === transactionFlow.fromAcc)?.short_description}</ResizableText>
                                {addressTypeTab === 'acc-bsb' && (
                                    <>
                                        <ResizableText>To: {transactionFlow.recipientAddress.accountName}</ResizableText>
                                        <ResizableText>BSB: {transactionFlow.recipientAddress.bsb}</ResizableText>
                                        <ResizableText>Account: {transactionFlow.recipientAddress.acc}</ResizableText>
                                    </>
                                )}
                                {addressTypeTab === 'pay-id' && (
                                    <ResizableText>To PayID: {transactionFlow.recipientAddress.payId}</ResizableText>
                                )}
                                {addressTypeTab === 'b-pay' && (
                                    <>
                                        <ResizableText>Biller Code: {transactionFlow.recipientAddress.billerCode}</ResizableText>
                                        <ResizableText>CRN: {transactionFlow.recipientAddress.crn}</ResizableText>
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