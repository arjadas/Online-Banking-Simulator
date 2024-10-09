import React from 'react';
import { Card, Text, Spacer, Grid } from '@geist-ui/core';
import { CreditCard } from '@geist-ui/react-icons';
import ResizableText from './ResizableText';

interface AccountCardProps {
  accountType: string;
  bsb: string;
  accountNumber: string;
  payID?: string; // Optional payID prop
  balance: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ accountType, bsb, accountNumber, payID, balance }) => {
  return (
    <Card width="100%" shadow padding={1}>
      <Card.Content>
        <Grid.Container gap={1}>
          <Grid xs={24}>
            <CreditCard size={24} />
            <Spacer inline w={0.5} />
            <ResizableText h3>{accountType}</ResizableText>
          </Grid>
          <Grid xs={12} direction="column">
            <ResizableText small>BSB: {bsb}</ResizableText>
            <ResizableText small>Account Number: {accountNumber}</ResizableText>
            {payID && <ResizableText small>PayID: {payID}</ResizableText>} {/* Conditionally render PayID */}
          </Grid>
          <Grid xs={12} justify="flex-end" alignItems="center">
            <ResizableText h4>{balance}</ResizableText>
          </Grid>
        </Grid.Container>
      </Card.Content>
    </Card>
  );
};

export default AccountCard;
