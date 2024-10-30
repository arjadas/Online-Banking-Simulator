import { Text } from '@geist-ui/core';
import { addMonths, startOfDay } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RecurringTransactionWithRecipient } from '~/routes/app.upcoming';
import { GeneratedTransaction, getTransactionsForPeriodBulk } from '~/util/futureTransactionUtil';

interface UpcomingPaymentsListProps {
    recurringTransactions: RecurringTransactionWithRecipient[];
    userAccountIds: number[];
    renderGeneratedCard?: (props: {
        generatedTransaction: GeneratedTransaction;
        style: React.CSSProperties;
    }) => JSX.Element;
    renderCard?: (transaction: RecurringTransactionWithRecipient) => JSX.Element
}

export const UpcomingPaymentsList: React.FC<UpcomingPaymentsListProps> = ({
    recurringTransactions,
    userAccountIds,
    renderGeneratedCard,
    renderCard,
}) => {
    const [displayedTransactions, setDisplayedTransactions] = useState<(GeneratedTransaction | RecurringTransactionWithRecipient)[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchNextPage = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const startDate = addMonths(new Date(), page);
            const endDate = addMonths(startDate, 1);
            const newItems = getTransactionsForPeriodBulk(recurringTransactions, startOfDay(startDate), startOfDay(endDate));
            const gotSome = newItems.length > 0;

            if (gotSome) {
                setDisplayedTransactions(prev => [...prev, ...newItems]);
                setPage(prevPage => prevPage + 1);
            } else {
                console.warn(8989, startDate.toISOString(), endDate.toISOString())
            }

            setHasMore(gotSome);
        } finally {
            setIsLoading(false);
        }
    }, [page, isLoading, hasMore, recurringTransactions]);

    const checkIfScrolledToBottom = useCallback(() => {
        if (!containerRef.current) return false;

        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = containerRef.current;

        const threshold = 50;
        return scrollHeight - (scrollTop + clientHeight) < threshold;
    }, []);

    // Handle scroll events
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (!currentContainer) return;

        const handleScroll = () => {
            if (checkIfScrolledToBottom()) {
                fetchNextPage();
            }
        };

        currentContainer.addEventListener('scroll', handleScroll);

        return () => {
            currentContainer.removeEventListener('scroll', handleScroll);
        };
    }, [checkIfScrolledToBottom, fetchNextPage]);

    // Handle resize events
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (!currentContainer) return;

        const resizeObserver = new ResizeObserver(() => {
            if (checkIfScrolledToBottom()) {
                fetchNextPage();
            }
        });

        resizeObserver.observe(currentContainer);

        return () => {
            resizeObserver.disconnect();
        };
    }, [checkIfScrolledToBottom, fetchNextPage]);

    return (
        <div
            ref={containerRef}
            style={{
                maxHeight: '800px',
                overflowY: 'auto',
                scrollBehavior: 'smooth'
            }}
        >
            {displayedTransactions.map((transaction: RecurringTransactionWithRecipient | GeneratedTransaction) => (
                <div
                    key={('generatedDate' in transaction) ? `${transaction.transaction.recc_transaction_id}-${new Date(transaction.generatedDate).getTime()}` : (transaction as RecurringTransactionWithRecipient).recc_transaction_id}
                >
                    {renderGeneratedCard ? renderGeneratedCard({
                        generatedTransaction: transaction as GeneratedTransaction,
                        style: { marginBottom: '0.5rem' }
                    }) : renderCard!(transaction as RecurringTransactionWithRecipient)}
                </div>
            ))}
            {(isLoading || hasMore) && (
                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    opacity: isLoading ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}>
                    <Text small>Loading more...</Text>
                </div>
            )}
        </div>
    );
};