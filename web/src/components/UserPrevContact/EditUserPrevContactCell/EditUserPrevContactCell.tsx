import type {
  EditUserPrevContactByUserId,
  UpdateUserPrevContactInput,
  UpdateUserPrevContactMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserPrevContactForm from 'src/components/UserPrevContact/UserPrevContactForm'

export const QUERY: TypedDocumentNode<EditUserPrevContactByUserId> = gql`
  query EditUserPrevContactByUserId($user_id: String!) {
    userPrevContact: userPrevContact(user_id: $user_id) {
      user_id
      contact_acc
      contact_acc_name
      contact_uid
      contact_description
    }
  }
`

const UPDATE_USER_PREV_CONTACT_MUTATION: TypedDocumentNode<
  EditUserPrevContactById,
  UpdateUserPrevContactMutationVariables
> = gql`
  mutation UpdateUserPrevContactMutation(
    $user_id: String!
    $input: UpdateUserPrevContactInput!
  ) {
    updateUserPrevContact(user_id: $user_id, input: $input) {
      user_id
      contact_acc
      contact_acc_name
      contact_uid
      contact_description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userPrevContact,
}: CellSuccessProps<EditUserPrevContactByUserId>) => {
  const [updateUserPrevContact, { loading, error }] = useMutation(
    UPDATE_USER_PREV_CONTACT_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserPrevContact updated')
        navigate(routes.userPrevContacts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateUserPrevContactInput,
    id: EditUserPrevContactByUserId['userPrevContact']['id']
  ) => {
    updateUserPrevContact({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit UserPrevContact {userPrevContact?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserPrevContactForm
          userPrevContact={userPrevContact}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
