import MockUserCell from 'src/components/MockUser/MockUserCell'

type MockUserPageProps = {
  uid: string
}

const MockUserPage = ({ uid }: MockUserPageProps) => {
  return <MockUserCell uid={uid} />
}

export default MockUserPage
