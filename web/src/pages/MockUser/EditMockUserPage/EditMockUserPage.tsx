import EditMockUserCell from 'src/components/MockUser/EditMockUserCell'

type MockUserPageProps = {
  uid: string
}

const EditMockUserPage = ({ uid }: MockUserPageProps) => {
  return <EditMockUserCell uid={uid} />
}

export default EditMockUserPage
