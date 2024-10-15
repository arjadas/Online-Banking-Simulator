// Helper function to get the badge color based on the account type
export const getBadgeColor = (accountName: string, isExternalUser = false) => {
    if (isExternalUser) return "#d1d417";
    if (accountName.includes("Debit")) return "#4287f5";
    if (accountName.includes("Credit")) return "#11bf68";
    if (accountName.includes("Saver")) return "#bf116e";
    return "gray";
};