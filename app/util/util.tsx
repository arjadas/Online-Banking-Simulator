import { Shuffle, User } from "@geist-ui/icons";

// Helper function to get the badge color based on the account type
export const getBadgeColor = (accountName: string, isExternalUser = false) => {
  if (isExternalUser) return "gray";
  if (accountName.includes("Debit")) return "#4287f5";
  if (accountName.includes("Credit")) return "#11bf68";
  if (accountName.includes("Saver")) return "#bf116e";
  return "red";
};

// Display a number like 300000 as 3,000.00
export function toFixedWithCommas(number: number, decimalPlaces = 2) {
  const fixed = number.toFixed(decimalPlaces);
  const parts = fixed.split('.');

  // Add commas to the whole number part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}

export const getFullDay = (day: string) => {
  switch (day) {
    case 'mon': return 'Monday';
    case 'tue': return 'Tuesday';
    case 'wed': return 'Wednesday';
    case 'thu': return 'Thursday';
    case 'fri': return 'Friday';
    case 'sat': return 'Saturday';
    case 'sun': return 'Sunday';
    default: return day;
  }
};

export const joinWithAmpersand = (arr: string[]) => {
  if (!arr.length) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} & ${arr[1]}`;

  return `${arr.slice(0, -1).join(', ')} & ${arr.slice(-1)}`;
};

export function splitLists<T>(items: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return [
      items.filter(predicate),
      items.filter(item => !predicate(item))
  ];
}

// Function to format the date as "Day, 23rd Sep (Today)" for display
export const formatDate = (transactionDate: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(transactionDate);
  const relativeDateInfo = getRelativeDateInfo(transactionDate);

  return `${formattedDate}${relativeDateInfo ? ` (${relativeDateInfo})` : ''}`;
};

export const getRelativeDateInfo = (transactionDate: Date): string => {
  const now = new Date();
  const differenceInDays = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays === 1) {
    return "Yesterday";
  } else if (differenceInDays === -1) {
    return "Tomorrow";
  } else if (differenceInDays > 0) {
    return `${differenceInDays} days ago`;
  } else if (differenceInDays < 0) {
    return `in ${-differenceInDays} days`;
  }
  return '';
};

// Function to convert a date into "DD/MM/YYYY" for search comparison
export const formatSearchDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
  const year = date.getFullYear();

  return `${day}/${month}/${year}`; // Australian date format
};

// Determine the correct icon based on whether the transaction is internal or external
export const getTransactionIcon = (userAccountIds: number[], accountId: number) => {
  return userAccountIds.includes(accountId)
    ? <Shuffle size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
    : <User size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />;
};