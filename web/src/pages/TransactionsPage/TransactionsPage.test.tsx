import { render } from '@redwoodjs/testing/web'

import TransactionsPage from './TransactionsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TransactionsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TransactionsPage />)
    }).not.toThrow()
  })
})
