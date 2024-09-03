// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Transactions" titleTo="transactions" buttonLabel="New Transaction" buttonTo="newTransaction">
        <Route path="/transactions/new" page={TransactionNewTransactionPage} name="newTransaction" />
        <Route path="/transactions/{id:Int}/edit" page={TransactionEditTransactionPage} name="editTransaction" />
        <Route path="/transactions/{id:Int}" page={TransactionTransactionPage} name="transaction" />
      </Set>
      <Route path="/transactions" page={TransactionsPage} name="transactions" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
