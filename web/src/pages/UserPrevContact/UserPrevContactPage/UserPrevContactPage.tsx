import UserPrevContactCell from 'src/components/UserPrevContact/UserPrevContactCell'

type UserPrevContactPageProps = {
  user_id: string
}

const UserPrevContactPage = ({ user_id }: UserPrevContactPageProps) => {
  return <UserPrevContactCell user_id={user_id} />
}

export default UserPrevContactPage
