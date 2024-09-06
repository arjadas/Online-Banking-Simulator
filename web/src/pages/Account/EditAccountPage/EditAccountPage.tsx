import EditAccountCell from 'src/components/Account/EditAccountCell'

type AccountPageProps = {
  acc: number
}

const EditAccountPage = ({ acc }: AccountPageProps) => {
  return <EditAccountCell acc={acc} />
}

export default EditAccountPage
