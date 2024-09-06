import EditRecurringTransactionCell from 'src/components/RecurringTransaction/EditRecurringTransactionCell'

type RecurringTransactionPageProps = {
  recc_transaction_id: number
}

const EditRecurringTransactionPage = ({
  recc_transaction_id,
}: RecurringTransactionPageProps) => {
  return (
    <EditRecurringTransactionCell recc_transaction_id={recc_transaction_id} />
  )
}

export default EditRecurringTransactionPage
