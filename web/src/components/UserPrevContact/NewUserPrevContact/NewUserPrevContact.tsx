import type {
  CreateUserPrevContactMutation,
  CreateUserPrevContactInput,
  CreateUserPrevContactMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserPrevContactForm from 'src/components/UserPrevContact/UserPrevContactForm'

const CREATE_USER_PREV_CONTACT_MUTATION: TypedDocumentNode<
  CreateUserPrevContactMutation,
  CreateUserPrevContactMutationVariables
> = gql`
  mutation CreateUserPrevContactMutation($input: CreateUserPrevContactInput!) {
    createUserPrevContact(input: $input) {
      user_id
    }
  }
`

const NewUserPrevContact = () => {
  const [createUserPrevContact, { loading, error }] = useMutation(
    CREATE_USER_PREV_CONTACT_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserPrevContact created')
        navigate(routes.userPrevContacts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateUserPrevContactInput) => {
    createUserPrevContact({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New UserPrevContact</h2>
      </header>
      <div className="rw-segment-main">
        <UserPrevContactForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUserPrevContact
