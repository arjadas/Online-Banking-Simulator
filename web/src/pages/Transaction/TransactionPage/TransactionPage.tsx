import TransactionCell from 'src/components/Transaction/TransactionCell'

type TransactionPageProps = {
  transaction_id: number
}

const TransactionPage = ({ transaction_id }: TransactionPageProps) => {
  return <TransactionCell transaction_id={transaction_id} />
}

export default TransactionPage
