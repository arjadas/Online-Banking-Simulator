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
      <Set wrap={ScaffoldLayout} title="UserPrevContacts" titleTo="userPrevContacts" buttonLabel="New UserPrevContact" buttonTo="newUserPrevContact">
        <Route path="/user-prev-contacts/new" page={UserPrevContactNewUserPrevContactPage} name="newUserPrevContact" />
        <Route path="/user-prev-contacts/{user_id}/edit" page={UserPrevContactEditUserPrevContactPage} name="editUserPrevContact" />
        <Route path="/user-prev-contacts/{user_id}" page={UserPrevContactUserPrevContactPage} name="userPrevContact" />
        <Route path="/user-prev-contacts" page={UserPrevContactUserPrevContactsPage} name="userPrevContacts" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Notifications" titleTo="notifications" buttonLabel="New Notification" buttonTo="newNotification">
        <Route path="/notifications/new" page={NotificationNewNotificationPage} name="newNotification" />
        <Route path="/notifications/{notification_id}/edit" page={NotificationEditNotificationPage} name="editNotification" />
        <Route path="/notifications/{notification_id}" page={NotificationNotificationPage} name="notification" />
        <Route path="/notifications" page={NotificationNotificationsPage} name="notifications" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{uid}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{uid}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set>
      <Set wrap={ScaffoldLayout} title="DefaultTransactions" titleTo="defaultTransactions" buttonLabel="New DefaultTransaction" buttonTo="newDefaultTransaction">
        <Route path="/default-transactions/new" page={DefaultTransactionNewDefaultTransactionPage} name="newDefaultTransaction" />
        <Route path="/default-transactions/{def_transaction_id:Int}/edit" page={DefaultTransactionEditDefaultTransactionPage} name="editDefaultTransaction" />
        <Route path="/default-transactions/{def_transaction_id:Int}" page={DefaultTransactionDefaultTransactionPage} name="defaultTransaction" />
        <Route path="/default-transactions" page={DefaultTransactionDefaultTransactionsPage} name="defaultTransactions" />
      </Set>
      <Set wrap={ScaffoldLayout} title="MockUsers" titleTo="mockUsers" buttonLabel="New MockUser" buttonTo="newMockUser">
        <Route path="/mock-users/new" page={MockUserNewMockUserPage} name="newMockUser" />
        <Route path="/mock-users/{uid}/edit" page={MockUserEditMockUserPage} name="editMockUser" />
        <Route path="/mock-users/{uid}" page={MockUserMockUserPage} name="mockUser" />
        <Route path="/mock-users" page={MockUserMockUsersPage} name="mockUsers" />
      </Set>
      <Set wrap={ScaffoldLayout} title="RecurringTransactions" titleTo="recurringTransactions" buttonLabel="New RecurringTransaction" buttonTo="newRecurringTransaction">
        <Route path="/recurring-transactions/new" page={RecurringTransactionNewRecurringTransactionPage} name="newRecurringTransaction" />
        <Route path="/recurring-transactions/{recc_transaction_id:Int}/edit" page={RecurringTransactionEditRecurringTransactionPage} name="editRecurringTransaction" />
        <Route path="/recurring-transactions/{recc_transaction_id:Int}" page={RecurringTransactionRecurringTransactionPage} name="recurringTransaction" />
        <Route path="/recurring-transactions" page={RecurringTransactionRecurringTransactionsPage} name="recurringTransactions" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Accounts" titleTo="accounts" buttonLabel="New Account" buttonTo="newAccount">
        <Route path="/accounts/new" page={AccountNewAccountPage} name="newAccount" />
        <Route path="/accounts/{acc:Int}/edit" page={AccountEditAccountPage} name="editAccount" />
        <Route path="/accounts/{acc:Int}" page={AccountAccountPage} name="account" />
        <Route path="/accounts" page={AccountAccountsPage} name="accounts" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Transactions" titleTo="transactions" buttonLabel="New Transaction" buttonTo="newTransaction">
        <Route path="/transactions/new" page={TransactionNewTransactionPage} name="newTransaction" />
        <Route path="/transactions/{id:Int}/edit" page={TransactionEditTransactionPage} name="editTransaction" />
        <Route path="/transactions/{id:Int}" page={TransactionTransactionPage} name="transaction" />
        <Route path="/transactions" page={TransactionTransactionsPage} name="transactions" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
