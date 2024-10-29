import { addDays, addMonths, addWeeks, addYears, isAfter, isBefore } from 'date-fns';
import { DayFrequency, FrequencyObject, MonthFrequency, MonthlyOccurrences, WeekDays, WeekFrequency, YearFrequency } from '~/components/ReccuringTransactionModal';
import { RecurringTransactionWithRecipient } from '~/routes/app.upcoming';

type GeneratedTransaction = {
    generatedDate: Date;
    transaction: RecurringTransactionWithRecipient
}

function parseFrequency(frequencyStr: string): FrequencyObject {
    return JSON.parse(frequencyStr) as FrequencyObject;
}

function isOneOffPayment(transaction: RecurringTransactionWithRecipient): boolean {
    return !transaction.frequency; // One-off payments don't have frequency
}

function* generateTransactions(
    transaction: RecurringTransactionWithRecipient,
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): Generator<GeneratedTransaction> {
    // Handle one-off payments
    if (isOneOffPayment(transaction)) {
        if (isAfter(transaction.starts_on, startDate) && isBefore(transaction.starts_on, endDate)) {
            yield {
                transaction,
                generatedDate: transaction.starts_on
            };
        }
        return;
    }

    const frequency = parseFrequency(transaction.frequency);
    let currentDate = new Date(Math.max(Date.parse(transaction.starts_on as any as string), startDate.getTime()));

    while (isBefore(currentDate, endDate) && (!transaction.ends_on || isBefore(currentDate, transaction.ends_on))) {
        switch (frequency.unit) {
            case 'days': {
                const dayFreq = frequency as DayFrequency;
                if (isBefore(currentDate, endDate)) {
                    yield {
                        transaction,
                        generatedDate: currentDate
                    };
                }
                currentDate = addDays(currentDate, dayFreq.count);
                break;
            }

            case 'weeks': {
                const weekFreq = frequency as WeekFrequency;
                const weekDays: Array<{ day: keyof WeekDays; value: number }> = [
                    { day: 'mon', value: 1 },
                    { day: 'tue', value: 2 },
                    { day: 'wed', value: 3 },
                    { day: 'thu', value: 4 },
                    { day: 'fri', value: 5 },
                    { day: 'sat', value: 6 },
                    { day: 'sun', value: 0 }
                ];

                for (const { day, value } of weekDays) {
                    if (weekFreq[day] && currentDate.getDay() <= value) {
                        const transactionDate = addDays(currentDate, value - currentDate.getDay());
                        if (isBefore(transactionDate, endDate)) {
                            yield {
                                transaction,
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
                        generatedDate: transactionDate
                    };
                }
                currentDate = addYears(currentDate, yearFreq.count);
                break;
            }
        }
    }
}

// Helper function to get an array of transactions for a specific period
function getTransactionsForPeriod(
    transaction: RecurringTransactionWithRecipient,
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): GeneratedTransaction[] {
    return Array.from(generateTransactions(transaction, startDate, endDate));
}

// New function to handle multiple transactions
function getTransactionsForPeriodBulk(
    transactions: RecurringTransactionWithRecipient[],
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): GeneratedTransaction[] {
    // Create generators for all transactions
    const generators = transactions.map(transaction =>
        generateTransactions(transaction, startDate, endDate)
    );

    // Initialize array to track the next transaction from each generator
    const nextTransactions: (GeneratedTransaction | null)[] = generators.map(gen => {
        const next = gen.next();
        return next.done ? null : next.value;
    });

    const result: GeneratedTransaction[] = [];

    // Keep going while we have any valid next transactions
    while (nextTransactions.some(t => t !== null)) {
        // Find the earliest transaction among all next transactions
        let earliestIndex = -1;
        let earliestDate = new Date(8640000000000000); // Max date

        nextTransactions.forEach((transaction, index) => {
            if (transaction && transaction.generatedDate < earliestDate) {
                earliestDate = transaction.generatedDate;
                earliestIndex = index;
            }
        });

        if (earliestIndex !== -1) {
            // Add the earliest transaction to our result
            result.push(nextTransactions[earliestIndex]!);

            // Get the next transaction from the generator that produced the earliest
            const next = generators[earliestIndex].next();
            nextTransactions[earliestIndex] = next.done ? null : next.value;
        }
    }

    return result;
}

export {
    generateTransactions,
    getTransactionsForPeriod,
    getTransactionsForPeriodBulk,
    type GeneratedTransaction
};

