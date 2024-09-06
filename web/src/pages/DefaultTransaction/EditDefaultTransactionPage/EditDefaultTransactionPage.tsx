import EditDefaultTransactionCell from 'src/components/DefaultTransaction/EditDefaultTransactionCell'

type DefaultTransactionPageProps = {
  def_transaction_id: number
}

const EditDefaultTransactionPage = ({
  def_transaction_id,
}: DefaultTransactionPageProps) => {
  return <EditDefaultTransactionCell def_transaction_id={def_transaction_id} />
}

export default EditDefaultTransactionPage
