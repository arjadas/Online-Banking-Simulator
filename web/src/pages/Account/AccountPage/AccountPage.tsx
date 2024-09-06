import AccountCell from 'src/components/Account/AccountCell'

type AccountPageProps = {
  acc: number
}

const AccountPage = ({ acc }: AccountPageProps) => {
  return <AccountCell acc={acc} />
}

export default AccountPage
