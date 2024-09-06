import EditTransactionCell from 'src/components/Transaction/EditTransactionCell'

type TransactionPageProps = {
  transaction_id: number
}

const EditTransactionPage = ({ transaction_id }: TransactionPageProps) => {
  return <EditTransactionCell transaction_id={transaction_id} />
}

export default EditTransactionPage
