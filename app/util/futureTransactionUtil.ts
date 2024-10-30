/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecurringTransaction } from '@prisma/client';
import { addDays, addMonths, addWeeks, addYears, endOfDay, isAfter, isBefore } from 'date-fns';
import { getFullDay, joinWithAmpersand } from './util.ts';

export type RecurringTransactionWithRecipient = RecurringTransaction & {
    recipient: {
        acc: number;
        acc_name: string;
        short_description: string;
    };
    sender: {
        acc: number;
        acc_name: string;
        short_description: string;
    };
};

export type FrequencyUnit = 'days' | 'weeks' | 'months' | 'years';

export interface WeekDays {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
}

export interface MonthlyOccurrences {
    occurrence1: boolean;
    occurrence2: boolean;
    occurrence3: boolean;
    occurrence4: boolean;
}

export interface DayFrequency {
    unit: 'days';
    count: number;
}

export interface WeekFrequency extends WeekDays {
    unit: 'weeks';
    count: number;
}

export interface MonthFrequency extends WeekDays, MonthlyOccurrences {
    unit: 'months';
    count: number;
}

export interface YearFrequency {
    unit: 'years';
    count: number;
    date: string;
}

export type FrequencyObject = DayFrequency | WeekFrequency | MonthFrequency | YearFrequency;

export const generateRandomFrequencyObject = (): FrequencyObject => {
    const units: FrequencyUnit[] = ['days', 'weeks', 'months'];
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const count = Math.floor(Math.random() * 10) + 1;

    switch (randomUnit) {
        case 'days':
            return {
                unit: 'days',
                count: count
            };

        case 'weeks':
            return {
                unit: 'weeks',
                count: count,
                ...generateRandomWeekDays()
            };

        case 'months':
            return {
                unit: 'months',
                count: count,
                ...generateRandomWeekDays(),
                ...generateRandomMonthlyOccurrences()
            };

        default:
            throw new Error('Invalid frequency unit');
    }
}

function generateRandomWeekDays(): WeekDays {
    return {
        mon: Math.random() < 0.5,
        tue: Math.random() < 0.5,
        wed: Math.random() < 0.5,
        thu: Math.random() < 0.5,
        fri: Math.random() < 0.5,
        sat: Math.random() < 0.5,
        sun: Math.random() < 0.5
    };
}

function generateRandomMonthlyOccurrences(): MonthlyOccurrences {
    return {
        occurrence1: Math.random() < 0.5,
        occurrence2: Math.random() < 0.5,
        occurrence3: Math.random() < 0.5,
        occurrence4: Math.random() < 0.5
    };
}

export const frequencyObjectToString = (frequency: FrequencyObject) => {
    const countStr = frequency.count > 1 ? `${frequency.count} ` : '';
    const includesDay = (keyVal: [string, string]) => {
        const [key, value] = keyVal;
        return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(key) && value;
    }

    switch (frequency.unit) {
        case 'days':
            return `Every ${frequency.count > 1 ? frequency.count : ''} day${frequency.count > 1 ? 's' : ''}.`;

        case 'weeks': {
            const weekDays = joinWithAmpersand(Object.entries(frequency)
                .filter((keyVal) => includesDay(keyVal))
                .map(([key]) => getFullDay(key)));
            return `Every ${countStr}week${frequency.count > 1 ? 's' : ''} on ${weekDays}.`;
        }

        case 'months': {
            const monthDays = joinWithAmpersand(Object.entries(frequency)
                .filter((keyVal) => includesDay(keyVal))
                .map(([key]) => getFullDay(key)));
            const occurrences = Object.entries(frequency)
                .filter(([key, value]) => key.startsWith('occurrence') && value)
                .map(([key]) => key.replace('occurrence', ''));
            const occurrencesStr = joinWithAmpersand(occurrences);

            return `Every ${countStr}month${frequency.count > 1 ? 's' : ''} on week${occurrences.length > 1 ? 's' : ''} ${occurrencesStr}, on ${monthDays}.`;
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

type GeneratedTransaction = {
    generatedDate: Date;
    processed: boolean;
    transaction: RecurringTransaction | RecurringTransactionWithRecipient
}

function parseFrequency(frequencyStr: string): FrequencyObject {
    return JSON.parse(frequencyStr) as FrequencyObject;
}

function isOneOffPayment(transaction: RecurringTransaction | RecurringTransactionWithRecipient): boolean {
    return transaction.starts_on === transaction.ends_on; // rule for one-off payments
}

function* generateTransactions(
    transaction: RecurringTransaction,
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): Generator<GeneratedTransaction> {
    // Handle one-off payments
    if (isOneOffPayment(transaction)) {
        if (isAfter(transaction.starts_on, startDate) && isBefore(transaction.starts_on, endDate)) {
            yield {
                transaction,
                processed: false,
                generatedDate: new Date(transaction.starts_on)
            };
        }
        return;
    }

    let currentDate = new Date(Math.max(
        Date.parse(transaction.starts_on as any as string),
        startDate.getTime()
    ));

    while (isBefore(currentDate, endDate) && (!transaction.ends_on || isBefore(currentDate, transaction.ends_on))) {
        const frequency = parseFrequency(transaction.frequency);
        switch (frequency.unit) {
            case 'days': {
                const dayFreq = frequency as DayFrequency;
                if (isBefore(currentDate, endDate)) {
                    yield {
                        transaction,
                        processed: false,
                        generatedDate: currentDate
                    };
                }
                currentDate = addDays(currentDate, dayFreq.count);
                break;
            }

            case 'weeks': {
                const weekFreq = frequency as WeekFrequency;
                const weekDays: Array<{ day: keyof WeekDays; value: number }> = [
                    { day: 'sun', value: 0 },
                    { day: 'mon', value: 1 },
                    { day: 'tue', value: 2 },
                    { day: 'wed', value: 3 },
                    { day: 'thu', value: 4 },
                    { day: 'fri', value: 5 },
                    { day: 'sat', value: 6 }
                ];

                // Get all enabled days for this frequency
                const enabledDays = weekDays
                    .filter(({ day }) => weekFreq[day])
                    .map(({ value }) => value);

                if (enabledDays.length > 0) {
                    // Find next occurrence for each enabled day
                    for (const dayValue of enabledDays) {
                        let daysToAdd = (dayValue - currentDate.getDay() + 7) % 7;
                        // If we're starting on the same day and it's selected, include it
                        if (daysToAdd === 0 && dayValue === currentDate.getDay()) {
                            daysToAdd = 0;
                        }

                        const transactionDate = addDays(currentDate, daysToAdd);

                        if (isBefore(transactionDate, endDate) && transactionDate > new Date()) {
                            yield {
                                transaction,
                                processed: false,
                                generatedDate: transactionDate
                            };
                        }
                    }
                }

                currentDate = addWeeks(currentDate, weekFreq.count);
                break;
            }
            case 'months': {
                const monthFreq = frequency as MonthFrequency;
                const weekDays: Array<{ day: keyof WeekDays; value: number }> = [
                    { day: 'mon', value: 1 },
                    { day: 'tue', value: 2 },
                    { day: 'wed', value: 3 },
                    { day: 'thu', value: 4 },
                    { day: 'fri', value: 5 },
                    { day: 'sat', value: 6 },
                    { day: 'sun', value: 0 }
                ];

                const occurrences: Array<{ id: keyof MonthlyOccurrences; week: number }> = [
                    { id: 'occurrence1', week: 0 },
                    { id: 'occurrence2', week: 1 },
                    { id: 'occurrence3', week: 2 },
                    { id: 'occurrence4', week: 3 }
                ];

                for (const { id, week } of occurrences) {
                    if (monthFreq[id]) {
                        for (const { day, value } of weekDays) {
                            if (monthFreq[day]) {
                                let transactionDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                transactionDate = addDays(transactionDate, value - transactionDate.getDay());
                                if (transactionDate.getDay() !== value) {
                                    transactionDate = addDays(transactionDate, 7);
                                }
                                transactionDate = addWeeks(transactionDate, week);

                                if (transactionDate.getMonth() === currentDate.getMonth() &&
                                    isBefore(transactionDate, endDate) &&
                                    isAfter(transactionDate, startDate)) {
                                    yield {
                                        transaction,
                                        processed: false,
                                        generatedDate: transactionDate
                                    };
                                }
                            }
                        }
                    }
                }
                currentDate = addMonths(currentDate, monthFreq.count);
                break;
            }
            case 'years': {
                const yearFreq = frequency as YearFrequency;
                const [month, day] = yearFreq.date.split('-').map(num => parseInt(num));
                const transactionDate = new Date(currentDate.getFullYear(), month - 1, day);

                if (isBefore(transactionDate, endDate) && isAfter(transactionDate, startDate)) {
                    yield {
                        transaction,
                        processed: false,
                        generatedDate: transactionDate
                    };
                }
                currentDate = addYears(currentDate, yearFreq.count);
                break;
            }
        }
    }
}

function getTransactionsForPeriodBulk(
    transactions: RecurringTransaction[] | RecurringTransactionWithRecipient[],
    startDate: Date = addDays(new Date(), -2),
    endDate: Date = endOfDay(new Date())
): GeneratedTransaction[] {
    if (!transactions) return [];

    const generators = transactions.map(transaction =>
        generateTransactions(transaction, startDate, endDate)
    );

    const nextTransactions: (GeneratedTransaction | null)[] = generators.map(gen => {
        const next = gen.next();
        return next.value;
    });

    const result: GeneratedTransaction[] = [];

    while (nextTransactions.some(t => t && !t.processed && t.generatedDate <= endDate)) {
        let earliestIndex = -1;
        let earliestDate = new Date(8640000000000000);

        nextTransactions.forEach((transaction, index) => {
            if (transaction && !transaction.processed && new Date(transaction.generatedDate) < new Date(earliestDate) && new Date(transaction.generatedDate) <= new Date(endDate)) {
                earliestDate = transaction.generatedDate;
                earliestIndex = index;
            }
        });

        if (earliestIndex !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const transactionToProcess = nextTransactions[earliestIndex]!;

            // Process the transaction
            transactionToProcess.processed = true;
            result.push(transactionToProcess);

            // For one-off transactions, set the next transaction to null
            if (isOneOffPayment(transactionToProcess.transaction)) {
                nextTransactions[earliestIndex] = null;
            } else {
                // For recurring transactions, get the next one
                const next = generators[earliestIndex].next();
                nextTransactions[earliestIndex] = next.done ? null : next.value;
            }
        }
    }

    return result;
}

function getNextPaymentDate(
    transactions: RecurringTransaction[] | RecurringTransactionWithRecipient[],
    startDate: Date = new Date()
): Date | null {
    if (!transactions) return null;

    const generators = transactions.map(transaction =>
        generateTransactions(transaction, startDate)
    );

    let earliestDate: Date | null = null;

    for (const generator of generators) {
        const next = generator.next();
        if (!next.done) {
            const nextDate = next.value.generatedDate;
            if (earliestDate === null || nextDate < earliestDate) {
                earliestDate = nextDate;
            }
        }
    }

    return earliestDate;
}

export {
    generateTransactions, getNextPaymentDate,
    getTransactionsForPeriodBulk, type GeneratedTransaction
};