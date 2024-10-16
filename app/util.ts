// Helper function to get the badge color based on the account type
export const getBadgeColor = (accountName: string, isExternalUser = false) => {
    if (isExternalUser) return "#d1d417";
    if (accountName.includes("Debit")) return "#4287f5";
    if (accountName.includes("Credit")) return "#11bf68";
    if (accountName.includes("Saver")) return "#bf116e";
    return "gray";
};

// Display a number like 300000 as 3,000.00
export function toFixedWithCommas(number: number, decimalPlaces = 2) {
    const fixed = number.toFixed(decimalPlaces);
    const parts = fixed.split('.');

    // Add commas to the whole number part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

// Function to format the date as "Day, 23rd Sep (Today)" for display
export const formatDate = (transactionDate: Date) => {
    const now = new Date();
    const differenceInDays = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
  
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    };
  
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(transactionDate);
  
    if (differenceInDays === 0) {
      formattedDate += " (Today)";
    } else if (differenceInDays === 1) {
      formattedDate += " (Yesterday)";
    } else {
      formattedDate += ` (${differenceInDays} days ago)`;
    }
  
    return formattedDate;
  };
  
  // Function to convert a date into "DD/MM/YYYY" for search comparison
  export const formatSearchDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`; // Australian date format
  };