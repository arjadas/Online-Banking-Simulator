import type { FindMockUsers, FindMockUsersVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import MockUsers from 'src/components/MockUser/MockUsers'

export const QUERY: TypedDocumentNode<FindMockUsers, FindMockUsersVariables> =
  gql`
    query FindMockUsers {
      mockUsers {
        uid
        first_name
        surname
        description
        creation_timestamp
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No mockUsers yet. '}
      <Link to={routes.newMockUser()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindMockUsers>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  mockUsers,
}: CellSuccessProps<FindMockUsers, FindMockUsersVariables>) => {
  return <MockUsers mockUsers={mockUsers} />
}
