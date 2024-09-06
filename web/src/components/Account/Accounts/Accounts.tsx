import type {
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  FindAccounts,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Account/AccountsCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const AccountsList = ({ accounts }: FindAccounts) => {
  const [deleteAccount] = useMutation(DELETE_ACCOUNT_MUTATION, {
    onCompleted: () => {
      toast.success('Account deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (acc: DeleteAccountMutationVariables['acc']) => {
    if (confirm('Are you sure you want to delete account ' + acc + '?')) {
      deleteAccount({ variables: { acc } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Acc</th>
            <th>Acc name</th>
            <th>Uid</th>
            <th>Pay id</th>
            <th>Biller code</th>
            <th>Crn</th>
            <th>Short description</th>
            <th>Long description</th>
            <th>Opened timestamp</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.acc}>
              <td>{truncate(account.acc)}</td>
              <td>{truncate(account.acc_name)}</td>
              <td>{truncate(account.uid)}</td>
              <td>{truncate(account.pay_id)}</td>
              <td>{truncate(account.biller_code)}</td>
              <td>{truncate(account.crn)}</td>
              <td>{truncate(account.short_description)}</td>
              <td>{truncate(account.long_description)}</td>
              <td>{timeTag(account.opened_timestamp)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.account({ acc: account.acc })}
                    title={'Show account ' + account.acc + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editAccount({ acc: account.acc })}
                    title={'Edit account ' + account.acc}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete account ' + account.acc}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(account.acc)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AccountsList
