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