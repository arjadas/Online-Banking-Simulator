import React from 'react';
import { Card, Text, Spacer, Grid } from '@geist-ui/core';
import { CreditCard } from '@geist-ui/react-icons';

interface AccountCardProps {
  accountType: string;
  bsb: string;
  accountNumber: string;
  balance: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ accountType, bsb, accountNumber, balance }) => {
  return (
    <Card width="100%" shadow>
      <Card.Content>
        <Grid.Container gap={1}>
          <Grid xs={24}>
            <CreditCard size={24} />
            <Spacer inline w={0.5} />
            <Text h3>{accountType}</Text>
          </Grid>
          <Grid xs={12} direction="column">
            <Text small>BSB: {bsb}</Text>
            <Text small>Account Number: {accountNumber}</Text>
          </Grid>
          <Grid xs={12} justify="flex-end" alignItems="center">
            <Text h4>{balance}</Text>
          </Grid>
        </Grid.Container>
      </Card.Content>
    </Card>
  );
};

export default AccountCard;