import type {
  CreateMockUserMutation,
  CreateMockUserInput,
  CreateMockUserMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MockUserForm from 'src/components/MockUser/MockUserForm'

const CREATE_MOCK_USER_MUTATION: TypedDocumentNode<
  CreateMockUserMutation,
  CreateMockUserMutationVariables
> = gql`
  mutation CreateMockUserMutation($input: CreateMockUserInput!) {
    createMockUser(input: $input) {
      uid
    }
  }
`

const NewMockUser = () => {
  const [createMockUser, { loading, error }] = useMutation(
    CREATE_MOCK_USER_MUTATION,
    {
      onCompleted: () => {
        toast.success('MockUser created')
        navigate(routes.mockUsers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateMockUserInput) => {
    createMockUser({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New MockUser</h2>
      </header>
      <div className="rw-segment-main">
        <MockUserForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewMockUser
