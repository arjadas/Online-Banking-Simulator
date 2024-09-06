import UserCell from 'src/components/User/UserCell'

type UserPageProps = {
  uid: string
}

const UserPage = ({ uid }: UserPageProps) => {
  return <UserCell uid={uid} />
}

export default UserPage
