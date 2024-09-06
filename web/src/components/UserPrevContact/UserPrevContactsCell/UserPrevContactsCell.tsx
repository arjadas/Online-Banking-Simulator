import type {
  FindUserPrevContacts,
  FindUserPrevContactsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import UserPrevContacts from 'src/components/UserPrevContact/UserPrevContacts'

export const QUERY: TypedDocumentNode<
  FindUserPrevContacts,
  FindUserPrevContactsVariables
> = gql`
  query FindUserPrevContacts {
    userPrevContacts {
      user_id
      contact_acc
      contact_acc_name
      contact_uid
      contact_description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No userPrevContacts yet. '}
      <Link to={routes.newUserPrevContact()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindUserPrevContacts>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userPrevContacts,
}: CellSuccessProps<FindUserPrevContacts, FindUserPrevContactsVariables>) => {
  return <UserPrevContacts userPrevContacts={userPrevContacts} />
}
