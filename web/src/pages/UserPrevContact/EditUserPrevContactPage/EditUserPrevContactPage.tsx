import EditUserPrevContactCell from 'src/components/UserPrevContact/EditUserPrevContactCell'

type UserPrevContactPageProps = {
  user_id: string
}

const EditUserPrevContactPage = ({ user_id }: UserPrevContactPageProps) => {
  return <EditUserPrevContactCell user_id={user_id} />
}

export default EditUserPrevContactPage
