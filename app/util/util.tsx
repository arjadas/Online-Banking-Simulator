import { Shuffle, User } from "@geist-ui/icons";

// Determine the correct icon based on whether the transaction is internal or external
export const getTransactionIcon = (userAccountIds: number[], accountId: number) => {
  return userAccountIds.includes(accountId)
    ? <Shuffle size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
    : <User size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />;
};