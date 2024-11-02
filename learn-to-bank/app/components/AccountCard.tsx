import { Badge, Button, Card, Grid, Spacer, Tooltip } from '@geist-ui/core';
import { DollarSign, Emoji } from '@geist-ui/icons';
import { ArrowDownLeft, ArrowUpRight, CreditCard, User } from '@geist-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blankTransactionFlow, setTransactionFlow } from '~/appSlice';
import { RootState } from '~/store';
import { getBadgeColor } from '@parent/learn-to-bank-util/utils/util';
import ResizableText from './ResizableText';
import { useNavigate } from '@remix-run/react';

interface AccountCardProps {
  accountType: string;
  bsb: number;
  accountNumber: number;
  payID?: string;
  balance: string;
}

const getIcon = (accountName: string, isExternalUser = false) => {
  if (isExternalUser) return "#d1d417";
  if (accountName.includes("Debit")) return (<Emoji size={24} />);
  if (accountName.includes("Credit")) return (<CreditCard size={24} />);
  if (accountName.includes("Saver")) return (<DollarSign size={24} />);
  return "gray";
};

export const AccountCard: React.FC<AccountCardProps> = ({ accountType, bsb, accountNumber, payID, balance }) => {
  const [localTransActionFlow, setLocalTransActionFlow] = useState(blankTransactionFlow);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setTransactionFlow(localTransActionFlow));
  }, [dispatch, localTransActionFlow]);

  const handleTransActionFlow = (string: string) => () => {
    const tf = { ...localTransActionFlow };

    switch (string) {
      case 'fromAcc':
        tf.fromAcc = accountNumber;
        break;
      case 'toAcc':
        tf.toAcc = accountNumber;
        break;
      case 'fromAccPaySomeone':
        tf.fromAccPaySomeone = accountNumber;
        break;
    }

    setLocalTransActionFlow(tf);
    setTimeout(() => string === 'fromAccPaySomeone' ? navigate('/app/paySomeone') : navigate('/app/transfer'), 100);
  }

  return (
    <Card width="100%" shadow padding={1}>
      <Card.Content style={{ position: 'relative' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          position: 'absolute',
          right: '8px',
          top: '8px',
          zIndex: 1
        }}>
          <Tooltip text="Transfer into" type="dark">
            <Button auto scale={0.5} style={{
              border: 'none',
              padding: 5,
            }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={handleTransActionFlow('fromAcc')}>
              <ArrowDownLeft size={20} />
            </Button>
          </Tooltip>
          <Tooltip text="Transfer from" type="dark">
            <Button auto scale={0.5} style={{
              border: 'none',
              padding: 5,
            }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={handleTransActionFlow('toAcc')}>
              <ArrowUpRight size={20} />
            </Button>
          </Tooltip>
          <Tooltip text="Pay someone" type="dark">
            <Button auto scale={0.5} style={{
              border: 'none',
              padding: 5,
            }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={handleTransActionFlow('fromAccPaySomeone')}>
              <User size={20} />
            </Button>
          </Tooltip>
        </div>
        <Grid.Container gap={1}>
          <Grid xs={24}>
            <Badge.Anchor placement="topRight">
              {getIcon(accountType)}
              <Spacer inline w={0.5} />
              <ResizableText h3>{accountType}</ResizableText>
              <Badge scale={3} type="secondary" style={{ marginLeft: 28, marginTop: 28, backgroundColor: getBadgeColor(accountType) }} dot />
            </Badge.Anchor>
          </Grid>
          <Grid xs={12} direction="column">
            <ResizableText small>BSB: {bsb}</ResizableText>
            <ResizableText small>Account Number: {accountNumber}</ResizableText>
            {payID && <ResizableText small>PayID: {payID}</ResizableText>}
          </Grid>
          <Grid xs={12} justify="flex-end" alignItems="center">
            <ResizableText h3>{balance}</ResizableText>
          </Grid>
        </Grid.Container>
      </Card.Content>
    </Card>
  );
};