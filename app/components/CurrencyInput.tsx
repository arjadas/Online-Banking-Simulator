import React from 'react';
import { Grid, Input, Spacer } from '@geist-ui/core';
import { DollarSign } from '@geist-ui/icons';

function removeFirstInstance(str: string, char: string): string {
  const index = str.indexOf(char);
  if (index === -1) return str;
  return str.slice(0, index) + str.slice(index + 1);
}

interface CurrencyInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ amount, onAmountChange }) => {
  const handleAmountChange = (event: { target: { value: string; }; }) => {
    let inputValue = event.target.value;

    // Remove dollar sign and any non-numeric characters except the decimal point
    inputValue = inputValue.replace(/[^0-9.-]/g, '');
    let [whole, decimal] = inputValue.split('.');

    // Limit decimal to two digits
    if (decimal !== undefined && decimal.length > 2) {
      decimal = removeFirstInstance(decimal, '-');
    }

    // Still has 3 chars after the decimal, so move the first digit to the dollar amount
    if (decimal !== undefined && decimal.length > 2) {
      whole = whole + decimal[0]
      decimal = decimal.slice(1);
    }

    if (whole.length > 1) {
      whole = whole.replace(/-/g, '');
    }

    // Combine the parts again
    inputValue = decimal !== undefined ? `${whole}.${decimal}` : whole;

    // Remove leading zeros
    onAmountChange(inputValue.replace(/^0+/, ""));
  };

  const handleBlur = () => {
    let formattedValue = amount;

    // If there's no decimal part, add `.00`
    if (formattedValue && !formattedValue.includes('.')) {
      formattedValue += '.00';
    } else if (formattedValue.split('.')[1]?.length === 1) {
      // If only one digit after the decimal, pad to two decimal places
      formattedValue += '0';
    }

    if (formattedValue === '') {
      formattedValue = '-.--'
    }

    onAmountChange(formattedValue);
  };

  return (
    <Grid.Container gap={0} style={{ width: '100%' }}>
      <Grid xs={1} justify='center' alignItems='center' alignContent='center' >
        <DollarSign style={{ display: 'block' }} />
      </Grid>
      <Grid xs={1}>
      </Grid>
      <Grid xs={22} justify='flex-end' alignContent='center' alignItems='center'>
        <Input
          clearable
          width={'100%'}
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
          onBlur={handleBlur}
          onClearClick={() => onAmountChange('-.--')}
          name="amount"
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Grid>
    </Grid.Container>
  );
}

export default CurrencyInput;