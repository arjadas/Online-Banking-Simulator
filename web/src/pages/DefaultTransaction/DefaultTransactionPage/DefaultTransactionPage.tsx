import DefaultTransactionCell from 'src/components/DefaultTransaction/DefaultTransactionCell'

type DefaultTransactionPageProps = {
  def_transaction_id: number
}

const DefaultTransactionPage = ({
  def_transaction_id,
}: DefaultTransactionPageProps) => {
  return <DefaultTransactionCell def_transaction_id={def_transaction_id} />
}

export default DefaultTransactionPage
