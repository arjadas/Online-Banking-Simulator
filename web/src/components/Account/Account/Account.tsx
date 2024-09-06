import type {
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  FindAccountByAcc,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_ACCOUNT_MUTATION: TypedDocumentNode<
  DeleteAccountMutation,
  DeleteAccountMutationVariables
> = gql`
  mutation DeleteAccountMutation($acc: Int!) {
    deleteAccount(acc: $acc) {
      acc
    }
  }
`

interface Props {
  account: NonNullable<FindAccountByAcc['account']>
}

const Account = ({ account }: Props) => {
  const [deleteAccount] = useMutation(DELETE_ACCOUNT_MUTATION, {
    onCompleted: () => {
      toast.success('Account deleted')
      navigate(routes.accounts())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (acc: DeleteAccountMutationVariables['acc']) => {
    if (confirm('Are you sure you want to delete account ' + acc + '?')) {
      deleteAccount({ variables: { acc } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Account {account.acc} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Acc</th>
              <td>{account.acc}</td>
            </tr>
            <tr>
              <th>Acc name</th>
              <td>{account.acc_name}</td>
            </tr>
            <tr>
              <th>Uid</th>
              <td>{account.uid}</td>
            </tr>
            <tr>
              <th>Pay id</th>
              <td>{account.pay_id}</td>
            </tr>
            <tr>
              <th>Biller code</th>
              <td>{account.biller_code}</td>
            </tr>
            <tr>
              <th>Crn</th>
              <td>{account.crn}</td>
            </tr>
            <tr>
              <th>Short description</th>
              <td>{account.short_description}</td>
            </tr>
            <tr>
              <th>Long description</th>
              <td>{account.long_description}</td>
            </tr>
            <tr>
              <th>Opened timestamp</th>
              <td>{timeTag(account.opened_timestamp)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editAccount({ acc: account.acc })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(account.acc)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Account
