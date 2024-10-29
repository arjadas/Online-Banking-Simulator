import React, { useState } from 'react';
import { Modal, Button, Select, Input, useModal, Grid, Text } from '@geist-ui/react';
import ResizableText from './ResizableText';
import { getFullDay } from '~/util';

type FrequencyUnit = 'days' | 'weeks' | 'months' | 'years';

interface WeekDays {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
}

interface MonthlyOccurrences {
    occurrence1: boolean;
    occurrence2: boolean;
    occurrence3: boolean;
    occurrence4: boolean;
}

interface DayFrequency {
    unit: 'days';
    count: number;
}

interface WeekFrequency extends WeekDays {
    unit: 'weeks';
    count: number;
}

interface MonthFrequency extends WeekDays, MonthlyOccurrences {
    unit: 'months';
    count: number;
}

interface YearFrequency {
    unit: 'years';
    count: number;
    date: string;
}

export type FrequencyObject = DayFrequency | WeekFrequency | MonthFrequency | YearFrequency;

interface DayConfig {
    id: keyof WeekDays;
    label: string;
}

interface OccurrenceConfig {
    id: keyof MonthlyOccurrences;
    label: string;
}

interface FrequencySelectorProps {
    onFrequencyChange: (frequency: FrequencyObject) => void;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export const frequencyObjectToString = (frequency: FrequencyObject) => {
    const countStr = frequency.count > 1 ? `${frequency.count} ` : '';

    switch (frequency.unit) {
        case 'days':
            return `Every ${frequency.count > 1 ? frequency.count : ''} day${frequency.count > 1 ? 's' : ''}`;

        case 'weeks': {
            const weekDays = Object.entries(frequency)
                .filter(([key, value]) => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(key) && value)
                .map(([key]) => getFullDay(key))
                .join(', ');
            return `Every ${countStr}week${frequency.count > 1 ? 's' : ''} on ${weekDays}.`;
        }

        case 'months': {
            const monthDays = Object.entries(frequency)
                .filter(([key, value]) => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(key) && value)
                .map(([key]) => getFullDay(key))
                .join(', ');
            const occurrences = Object.entries(frequency)
                .filter(([key, value]) => key.startsWith('occurrence') && value)
                .map(([key]) => key.replace('occurrence', ''))
                .join(', ');
            return `Every ${countStr}month${frequency.count > 1 ? 's' : ''} on week ${occurrences}, on ${monthDays}.`;
        }

        case 'years': {
            const date = new Date(frequency.date);
            const monthName = date.toLocaleString('default', { month: 'long' });
            const day = date.getDate();
            return `Every ${countStr}year${frequency.count > 1 ? 's' : ''} on ${monthName} ${day}`;
        }

        default:
            return 'Invalid frequency';
    }
}

const FutureTransactionModal: React.FC<FrequencySelectorProps> = ({ onFrequencyChange, onStartDateChange,
    onEndDateChange }) => {
    const { visible, setVisible, bindings } = useModal();
    const [unit, setUnit] = useState<FrequencyUnit>('weeks');
    const [count, setCount] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const now = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState<string>(now);
    const [endDate, setEndDate] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<WeekDays>({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
    });

    const [monthlyOccurrences, setMonthlyOccurrences] = useState<MonthlyOccurrences>({
        occurrence1: false,
        occurrence2: false,
        occurrence3: false,
        occurrence4: false
    });

    const [yearlyDate, setYearlyDate] = useState<string>('');

    const weekDays: DayConfig[] = [
        { id: 'mon', label: 'M' },
        { id: 'tue', label: 'T' },
        { id: 'wed', label: 'W' },
        { id: 'thu', label: 'T' },
        { id: 'fri', label: 'F' },
        { id: 'sat', label: 'S' },
        { id: 'sun', label: 'S' }
    ];

    const occurrences: OccurrenceConfig[] = [
        { id: 'occurrence1', label: '1' },
        { id: 'occurrence2', label: '2' },
        { id: 'occurrence3', label: '3' },
        { id: 'occurrence4', label: '4' }
    ];

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value
        setStartDate(newStartDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
    };

    const validateInputs = (): string | null => {
        switch (unit) {
            case 'days':
                if (count <= 0) {
                    return "Please select a positive value.";
                }
                return null;
            case 'weeks':
                if (!Object.values(selectedDays).some(day => day)) {
                    return "Please select at least one day of the week.";
                }
                return null;
            case 'months':
                if (!Object.values(selectedDays).some(day => day)) {
                    return "Please select at least one day of the week.";
                }
                if (!Object.values(monthlyOccurrences).some(occurrence => occurrence)) {
                    return "Please select at least one week of the month.";
                }
                return null;
            case 'years':
                if (!yearlyDate) {
                    return "Please select a date for the yearly recurrence.";
                }
                return null;
        }
    };

    const generateFrequencyObject = (): FrequencyObject => {
        switch (unit) {
            case 'days':
                return { unit: 'days', count, };
            case 'weeks':
                return { unit: 'weeks', count, ...selectedDays };
            case 'months':
                return {
                    unit: 'months',
                    count,
                    ...monthlyOccurrences,
                    ...selectedDays
                };
            case 'years':
                return { unit: 'years', count, date: yearlyDate };
        }
    };

    const handleDayToggle = (day: keyof WeekDays): void => {
        setSelectedDays(prev => ({
            ...prev,
            [day]: !prev[day]
        }));

        // remove focus from the clicked button
        (window?.document?.activeElement as HTMLElement)?.blur();
    };

    const handleOccurrenceToggle = (occurrence: keyof MonthlyOccurrences): void => {
        setMonthlyOccurrences(prev => ({
            ...prev,
            [occurrence]: !prev[occurrence]
        }));
    };

    const handleDone = (): void => {
        const validationError = validateInputs();

        if (validationError) {
            setError(validationError);
            return;
        }

        const frequencyObject = generateFrequencyObject();

        // Setting to 12 am, in local time zone
        const startOfStartDate = new Date(startDate);
        startOfStartDate.setHours(0, 0, 0, 0);
        const startIsoString = startOfStartDate.toISOString();
        onFrequencyChange(frequencyObject);
        onStartDateChange(startIsoString);

        if (endDate) {
            const startOfEndDate = new Date(endDate);
            startOfEndDate.setHours(0, 0, 0, 0);
            const endIsoString = startOfEndDate.toISOString();
            onEndDateChange(endIsoString);
        }

        setVisible(false);
    };

    const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setCount(value);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setYearlyDate(new Date(e.target.value).toISOString());
    };

    return (
        <>
            <Button auto onClick={() => setVisible(true)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Set Frequency</Button>
            <Modal {...bindings} width="600px">
                <Modal.Title>Recurring Payment</Modal.Title>
                <Modal.Content padding={2}>
                    <Grid.Container gap={1}>
                        <Grid xs={24}>
                            <Grid.Container gap={1} alignItems="center" justify='flex-start'>
                                <Grid xs={8}><ResizableText small>Repeat every</ResizableText></Grid>
                                <Grid>
                                    <Input
                                        htmlType="number"
                                        min="1"
                                        value={count.toString()}
                                        onChange={handleCountChange}
                                        width="60px" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                                </Grid>
                                <Grid>
                                    <Select
                                        value={unit}
                                        onChange={(val) => {
                                            setUnit(val as FrequencyUnit);
                                            setError(null);
                                        }}
                                        width="120px" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <Select.Option value="days">{count == 1 ? 'day' : 'days'}</Select.Option>
                                        <Select.Option value="weeks">{count == 1 ? 'week' : 'weeks'}</Select.Option>
                                        <Select.Option value="months">{count == 1 ? 'month' : 'months'}</Select.Option>
                                        <Select.Option value="years">{count == 1 ? 'year' : 'years'}</Select.Option>
                                    </Select>
                                </Grid>
                            </Grid.Container>
                        </Grid>

                        {(unit === 'weeks' || unit === 'months') && (
                            <Grid xs={24} >
                                <Grid.Container gap={1} marginTop={1} justify='flex-start'>
                                    <Grid xs={8}><ResizableText small>Repeat on</ResizableText></Grid>
                                    {weekDays.map(({ id, label }) => (
                                        <Grid key={id}>
                                            <Button
                                                auto
                                                scale={0.75}
                                                type={selectedDays[id] ? "secondary" : "default"}
                                                onClick={() => handleDayToggle(id)}
                                                style={{ minWidth: '32px', height: '32px', padding: 0 }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid.Container>
                            </Grid>
                        )}

                        {unit === 'months' && (
                            <Grid xs={24}>
                                <Grid.Container gap={1} marginTop={1} justify='flex-start'>
                                    <Grid xs={8}><ResizableText small>Repeat on week</ResizableText></Grid>
                                    {occurrences.map(({ id, label }) => (
                                        <Grid key={id}>
                                            <Button
                                                auto
                                                scale={0.75}
                                                type={monthlyOccurrences[id] ? "secondary" : "default"}
                                                onClick={() => handleOccurrenceToggle(id)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid.Container>
                            </Grid>
                        )}

                        {unit === 'years' && (
                            <Grid xs={24}>
                                <Grid.Container gap={1} marginTop={1} justify='flex-start'>
                                    <Grid xs={8}><ResizableText small>Date</ResizableText></Grid>
                                    <Grid>
                                        <Input
                                            value={yearlyDate}
                                            onChange={handleDateChange}
                                            htmlType='date'
                                            width="120px" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />

                                    </Grid>
                                </Grid.Container>
                            </Grid>
                        )}

                        <Grid xs={24}>
                            <Grid.Container gap={1} marginTop={1} justify='flex-start'>
                                <Grid xs={8}><ResizableText small>Start Date</ResizableText></Grid>
                                <Grid>
                                    <Input
                                        htmlType="date"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        placeholder="Enter Start Date"
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                        crossOrigin={undefined}
                                    />
                                </Grid>
                            </Grid.Container>
                        </Grid>
                        <Grid xs={24}>
                            <Grid.Container gap={1} marginTop={1} justify='flex-start'>
                                <Grid xs={8}><ResizableText small>End Date</ResizableText></Grid>
                                <Grid>
                                    <Input
                                        htmlType="date"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        placeholder="Enter End Date"
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                        crossOrigin={undefined}
                                    />
                                </Grid>
                            </Grid.Container>
                        </Grid>
                    </Grid.Container>
                </Modal.Content>
                {error && (
                    <Modal.Content>
                        <Text type="error">{error}</Text>
                    </Modal.Content>
                )}
                <Modal.Action passive onClick={() => setVisible(false)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>Cancel</Modal.Action>
                <Modal.Action onClick={handleDone} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>Done</Modal.Action>
            </Modal >
        </>
    );
};

export default FutureTransactionModal;