import { Button, Card, Input, Select, Tabs, Text, Textarea,Spacer  } from '@geist-ui/core';
import { Account } from '@prisma/client';
import { Form, useActionData } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import CurrencyInput from '~/components/CurrencyInput';
import { UserPrevContactResult } from '~/routes/app.paySomeone';
import ResizableText from './ResizableText';

type RecipientAddress = {
    accountName: string;
    acc: number;
    bsb: number;
    payId: string;
    billerCode: number;
    crn: number;
};

interface PaySomeoneFormProps {
    accounts: Account[];
    userPrevContact?: UserPrevContactResult | null
    actionData: any;
    onBack: () => void;
}



const PaySomeoneForm: React.FC<PaySomeoneFormProps> = ({ accounts, userPrevContact, onBack, actionData }) => {
    const [fromAcc, setFromAcc] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState('-.--');
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [activeTab, setActiveTab] = useState('acc-bsb');
    const [recipientAddress, setRecipientAddress] = useState<RecipientAddress>({
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

    const updateRecipientAddress = (key: keyof RecipientAddress, value: string | number) => {
        setRecipientAddress(prevState => ({
            ...prevState,
            [key]: value,
        }));

        // Set active tab based on the input field
        if (key === 'acc' || key === 'bsb' || key === 'accountName') {
            setActiveTab('acc-bsb');
        } else if (key === 'payId') {
            setActiveTab('pay-id');
        } else if (key === 'billerCode' || key === 'crn') {
            setActiveTab('b-pay');
        }
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
            if (userPrevContact.contact_recipient_address) {
                const parsedAddress = JSON.parse(userPrevContact.contact_recipient_address) as Partial<RecipientAddress>;

                Object.entries(parsedAddress).forEach(([key, value]) => {
                    if (key in recipientAddress) {
                        updateRecipientAddress(key as keyof RecipientAddress, value);
                    }
                });
            }

            setDescription(userPrevContact.contact_description || '');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPrevContact]);
    const [isDateHovered, setIsDateHovered] = useState(false);
    const [isTimeHovered, setIsTimeHovered] = useState(false);
    const [isDateFocused, setIsDateFocused] = useState(false);
    const [isTimeFocused, setIsTimeFocused] = useState(false);
    
    const dateInputStyle = {
        width: '100%',
        backgroundColor: 'white',
        borderRadius:'6px',
        border: `1px solid ${isDateHovered || isDateFocused ? 'black' : 'white'}`,
        height:'4vh',
        transition: 'border-color 0.3s, color 0.3s',
    };
    
    const timeInputStyle = {
        width: '100%',
        backgroundColor: 'white',
        borderRadius:'6px',
        border: `1px solid ${isTimeHovered || isTimeFocused ? 'black' : 'white'}`,
        height:'4vh',
        transition: 'border-color 0.3s, color 0.3s',
    };
    return (
        <Card shadow width="100%" style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
            <Form method="post">
                <ResizableText h4>Schedule</ResizableText>
                <Tabs initialValue="now" hideDivider>
                    <Tabs.Item label="Now" value="now" >
                    
                        <Text>Set Up Immediate Payment</Text>
                        </Tabs.Item>
                        <Tabs.Item label="Later" value="later">
                    <Text>Select Date and Time for Transaction</Text>
                    <label style={{ fontWeight: 'bold' }}>Date:</label>
                    <input
                        type="date"
                        style={dateInputStyle}
                        onMouseEnter={() => setIsDateHovered(true)}
                        onMouseLeave={() => setIsDateHovered(false)}
                        onFocus={() => setIsDateFocused(true)}
                        onBlur={() => setIsDateFocused(false)}
                        placeholder="Enter Date"
                    />
                    <Spacer />
                    <label style={{ fontWeight: 'bold' }}>Time:</label>
                    <input
                        type="time"
                        style={timeInputStyle}
                        onMouseEnter={() => setIsTimeHovered(true)}
                        onMouseLeave={() => setIsTimeHovered(false)}
                        onFocus={() => setIsTimeFocused(true)}
                        onBlur={() => setIsTimeFocused(false)}
                        placeholder="Enter Time"
                    />
                </Tabs.Item>
                
                    <Tabs.Item label="Recurring" value="recurring">
                        <Text>Set Up Recurring payment</Text>
                        <div>
                            <Select placeholder="Select frequency" style={{ width: "100%" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                <Select.Option value="weekly">Weekly</Select.Option>
                                <Select.Option value="fortnightly">Fortnightly</Select.Option>
                                <Select.Option value="monthly">Monthly</Select.Option>
                            </Select>
                         </div>
                         <label style={{ fontWeight: 'bold' }}>Start Date:</label>
                    <input
                        type="date"
                        style={dateInputStyle}
                        onMouseEnter={() => setIsDateHovered(true)}
                        onMouseLeave={() => setIsDateHovered(false)}
                        onFocus={() => setIsDateFocused(true)}
                        onBlur={() => setIsDateFocused(false)}
                        placeholder="Enter Date"
                    />
                    <Spacer />
                    <label style={{ fontWeight: 'bold' }}>End Date:</label>
                    <input
                        type="date"
                        style={dateInputStyle}
                        onMouseEnter={() => setIsDateHovered(true)}
                        onMouseLeave={() => setIsDateHovered(false)}
                        onFocus={() => setIsDateFocused(true)}
                        onBlur={() => setIsDateFocused(false)}
                        placeholder="Enter Date"
                    />

                        
                    </Tabs.Item>
                </Tabs>
                <ResizableText h4>From Account</ResizableText>
                <div style={{ width: '100%' }}>
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
                <Tabs value={activeTab} onChange={setActiveTab} hideDivider style={{ marginTop: 20 }}>
                    <Tabs.Item label="ACC / BSB" value="acc-bsb">
                        <ResizableText h4>Account Name</ResizableText>
                        <Input width="100%" placeholder="Enter account name" aria-label="Account Name" value={recipientAddress.accountName} onChange={handleAccountNameChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <ResizableText h4 style={{ marginTop: 10 }}>Account Number</ResizableText>
                        <Input width="100%" placeholder="Enter account number" aria-label="Account Number" value={recipientAddress.acc === -1 ? '' : recipientAddress.acc.toString()} onChange={handleAccChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <ResizableText h4 style={{ marginTop: 10 }}>BSB</ResizableText>
                        <Input width="100%" placeholder="Enter bsb" aria-label="BSB" value={recipientAddress.bsb === -1 ? '' : recipientAddress.bsb.toString()} onChange={handleBsbChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Tabs.Item>
                    <Tabs.Item label="PayID" value="pay-id">
                        <ResizableText h4>PayID</ResizableText>
                        <Input width="100%" placeholder="Enter PayID" aria-label="PayID" value={recipientAddress.payId} onChange={handlePayIdChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Tabs.Item>
                    <Tabs.Item label="BPay" value="b-pay">
                        <ResizableText h4>Biller Code</ResizableText>
                        <Input width="100%" placeholder="Enter biller code" aria-label="Biller Code" value={recipientAddress.billerCode === -1 ? '' : recipientAddress.billerCode.toString()} onChange={handleBillerCodeChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <ResizableText h4 style={{ marginTop: 10 }}>CRN</ResizableText>
                        <Input width="100%" placeholder="Enter CRN" aria-label="CRN" value={recipientAddress.crn === -1 ? '' : recipientAddress.crn.toString()} onChange={handleCrnChange} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Tabs.Item>
                </Tabs>
                <input type="hidden" name="recipientAddress" value={JSON.stringify(recipientAddress)} />
                <ResizableText h4 style={{ marginTop: 10 }}>Amount</ResizableText>
                <CurrencyInput amount={amount} onAmountChange={function (amount: string) {
                    setAmount(amount);
                }} />
                <ResizableText h4 style={{ marginTop: 10 }}>Reference</ResizableText>
                <Textarea width="100%" placeholder="Enter reference" aria-label="Reference" name="reference" value={reference} onChange={handleReferenceChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <ResizableText h4 style={{ marginTop: 10 }}>Description</ResizableText>
                <Textarea width="100%" placeholder="Enter description" aria-label="Description" name="description" value={description} onChange={handleDescriptionChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginTop: 20 }}>
                    <Button auto placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={onBack} >Back</Button>
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
        </Card>
    );
};

export default PaySomeoneForm;