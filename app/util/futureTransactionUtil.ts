import { addDays, addMonths, addWeeks, addYears, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { DayFrequency, FrequencyObject, MonthFrequency, MonthlyOccurrences, WeekDays, WeekFrequency, YearFrequency } from '~/components/ReccuringTransactionModal';
import { RecurringTransactionWithRecipient } from '~/routes/app.upcoming';

type GeneratedTransaction = {
    generatedDate: Date;
    processed: boolean;
    transaction: RecurringTransactionWithRecipient
}

//TODO login info with a default recc payment
function parseFrequency(frequencyStr: string): FrequencyObject {
    return JSON.parse(frequencyStr) as FrequencyObject;
}

function isOneOffPayment(transaction: RecurringTransactionWithRecipient): boolean {
    return transaction.starts_on === transaction.ends_on; // rule for one-off payments
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
                processed: false,
                generatedDate: transaction.starts_on
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

// Helper function to get an array of transactions for a specific period
function getTransactionsForPeriod(
    transaction: RecurringTransactionWithRecipient,
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): GeneratedTransaction[] {
    return Array.from(generateTransactions(transaction, startDate, endDate));
}

function getTransactionsForPeriodBulk(
    transactions: RecurringTransactionWithRecipient[],
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): GeneratedTransaction[] {
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
    transactions: RecurringTransactionWithRecipient[],
    startDate: Date = new Date()
): Date | null {
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
    generateTransactions,
    getTransactionsForPeriod,
    getTransactionsForPeriodBulk,
    getNextPaymentDate,
    type GeneratedTransaction
};

