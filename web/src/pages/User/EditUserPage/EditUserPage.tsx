import EditUserCell from 'src/components/User/EditUserCell'

type UserPageProps = {
  uid: string
}

const EditUserPage = ({ uid }: UserPageProps) => {
  return <EditUserCell uid={uid} />
}

export default EditUserPage
