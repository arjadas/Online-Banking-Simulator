import RecurringTransactionCell from 'src/components/RecurringTransaction/RecurringTransactionCell'

type RecurringTransactionPageProps = {
  recc_transaction_id: number
}

const RecurringTransactionPage = ({
  recc_transaction_id,
}: RecurringTransactionPageProps) => {
  return <RecurringTransactionCell recc_transaction_id={recc_transaction_id} />
}

export default RecurringTransactionPage
