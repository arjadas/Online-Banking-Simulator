import EditTransactionCell from 'src/components/Transaction/EditTransactionCell'

type TransactionPageProps = {
  id: number
}

const EditTransactionPage = ({ id }: TransactionPageProps) => {
  return <EditTransactionCell id={id} />
}

export default EditTransactionPage
