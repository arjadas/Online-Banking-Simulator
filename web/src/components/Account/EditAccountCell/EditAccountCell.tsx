import type {
  EditAccountByAcc,
  UpdateAccountInput,
  UpdateAccountMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AccountForm from 'src/components/Account/AccountForm'

export const QUERY: TypedDocumentNode<EditAccountByAcc> = gql`
  query EditAccountByAcc($acc: Int!) {
    account: account(acc: $acc) {
      acc
      acc_name
      uid
      pay_id
      biller_code
      crn
      short_description
      long_description
      opened_timestamp
    }
  }
`

const UPDATE_ACCOUNT_MUTATION: TypedDocumentNode<
  EditAccountById,
  UpdateAccountMutationVariables
> = gql`
  mutation UpdateAccountMutation($acc: Int!, $input: UpdateAccountInput!) {
    updateAccount(acc: $acc, input: $input) {
      acc
      acc_name
      uid
      pay_id
      biller_code
      crn
      short_description
      long_description
      opened_timestamp
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ account }: CellSuccessProps<EditAccountByAcc>) => {
  const [updateAccount, { loading, error }] = useMutation(
    UPDATE_ACCOUNT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Account updated')
        navigate(routes.accounts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateAccountInput,
    id: EditAccountByAcc['account']['id']
  ) => {
    updateAccount({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Account {account?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <AccountForm
          account={account}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
