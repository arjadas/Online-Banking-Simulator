import { addDays, addMonths, addWeeks, addYears, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
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
    // Debug logging
    console.log(8989, 'Transaction start:', transaction.starts_on);
    console.log(8989, 'Input startDate:', startDate.toISOString());
    console.log(8989, 'Input endDate:', endDate.toISOString());

    // Handle one-off payments
    if (isOneOffPayment(transaction)) {
        console.log('One-off payment detected');
        if (isAfter(transaction.starts_on, startDate) && isBefore(transaction.starts_on, endDate)) {
            yield {
                transaction,
                generatedDate: transaction.starts_on
            };
        }
        return;
    }

    // Normalize dates to UTC midnight
    const normalizedStartDate = new Date(startDate);
  //  normalizedStartDate.setUTCHours(0, 0, 0, 0);

    const normalizedEndDate = new Date(endDate);
   // normalizedEndDate.setUTCHours(23, 59, 59, 999);

    // Use normalized dates for initial currentDate calculation
    let currentDate = new Date(Math.max(
        Date.parse(transaction.starts_on as any as string),
        normalizedStartDate.getTime()
    ));

    console.log(8989, 44, transaction.starts_on as any as string, normalizedStartDate.toISOString())

    console.log(8989, 'Calculated currentDate:', currentDate.toISOString());
    console.log(8989, 'Using frequency:', transaction.frequency);

    while (isBefore(currentDate, normalizedEndDate) && (!transaction.ends_on || isBefore(currentDate, transaction.ends_on))) {
        console.log(8989, 'fired')
        const frequency = parseFrequency(transaction.frequency);
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

function getTransactionsForPeriodBulk(
    transactions: RecurringTransactionWithRecipient[],
    startDate: Date = new Date(),
    endDate: Date = addYears(new Date(), 1)
): GeneratedTransaction[] {
    console.log('Processing bulk transactions');
    console.log('Number of transactions:', transactions.length);

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

