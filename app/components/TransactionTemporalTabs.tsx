import { Input, Spacer, Tabs } from '@geist-ui/react';
import React, { useState } from 'react';
import FutureTransactionModal, { FrequencyObject, frequencyObjectToString } from './ReccuringTransactionModal';
import ResizableText from './ResizableText';

interface TransactionTemporalTabsProps {
    onTemporalTabsChange: (value: string) => void;
}

export const TransactionTemporalTabs: React.FC<TransactionTemporalTabsProps> = ({ onTemporalTabsChange }) => {
    const [frequency, setFrequency] = useState<FrequencyObject | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [temporalTab, setTemporalTab] = useState('now');
    const [laterDate, setLaterDate] = useState('')
    const [recurringModalVisible, setRecurringModalVisible] = useState(false);

    const handleLaterDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value) setLaterDate(value);
    };

    const handleTemporalTabsChange = (val: string) => {
        if (val == 'recurring') {
            setRecurringModalVisible(true);
        }

        setTemporalTab(val);
        onTemporalTabsChange(val);
    };

    return (
        <>
            <ResizableText h4>Schedule</ResizableText>
            <Tabs style={{ fontWeight: '600' }} value={temporalTab} onChange={handleTemporalTabsChange} hideDivider>
                <Tabs.Item label="Now" value="now" >
                    <ResizableText>Transfer will be settled instantly.</ResizableText>
                    <Spacer />
                </Tabs.Item>
                <Tabs.Item label="Later" value="later" >
                    <Spacer />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 20, }}>
                        <ResizableText h4>Date</ResizableText>
                        <Input
                            name="laterDate"
                            htmlType="date"
                            value={laterDate}
                            onChange={handleLaterDateChange}
                            placeholder="Enter Date" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />

                    </div>
                    <Spacer />
                </Tabs.Item>
                <input type="hidden" name="frequencyObject" value={frequency ? JSON.stringify(frequency) : ''} />
                <input type="hidden" name="startDate" value={startDate} />
                <input type="hidden" name="endDate" value={endDate} />
                <Tabs.Item label="Recurring" value="recurring">
                    <Spacer />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 20}}>
                        <ResizableText h4>Frequency</ResizableText>
                        <FutureTransactionModal visible={recurringModalVisible} onFrequencyChange={function (frequency: FrequencyObject): void {
                            setFrequency(frequency);
                        }} onStartDateChange={function (date: string): void {
                            setStartDate(date);
                        }} onEndDateChange={function (date: string): void {
                            setEndDate(date);
                        }} onNotVisible={function (): void {
                            setRecurringModalVisible(false);
                        }} />
                    </div>
                    {frequency ?
                        <ResizableText>{frequencyObjectToString(frequency)}</ResizableText>
                        : <Spacer h={0.5} />}
                    <Spacer />
                </Tabs.Item>
            </Tabs>
        </>
    );
};