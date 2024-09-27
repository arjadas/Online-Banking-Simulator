import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransferState = { fromAcc: number | null, toAcc: number | null, amount: number | null, formattedAmount: string, description: string };

interface AppState {
    enabled: boolean;
    isDarkTheme: boolean;
    transferState: TransferState;
    textScale: number;
}

export const initialState: AppState = {
    enabled: true,
    isDarkTheme: false,
    transferState: {
        fromAcc: null,
        toAcc: null,
        amount: null,
        formattedAmount: "",
        description: "",
    },
    textScale: 100,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTextScale(state, action: PayloadAction<number>) {
            state.textScale = action.payload;
        },
        setEnabled(state, action: PayloadAction<boolean>) {
            state.enabled = action.payload;
        },
        setTransferStateFromAccount(state, action: PayloadAction<number>) {
            state.transferState.fromAcc = action.payload;
        },
        setTransferStateToAccount(state, action: PayloadAction<number>) {
            state.transferState.toAcc = action.payload;
        },
        setTransferStateAmount(state, action: PayloadAction<string>) {
            let inputValue = action.payload;
            inputValue = inputValue.replace(/[^0-9.]/g, '');
            //TODO fix this

            // Ensure only one decimal point is allowed
            const parts = inputValue.split('.');
            if (parts.length > 2) {
                inputValue = parts[0] + '.' + parts.slice(1).join('');
            }

            // Format the number to 2 decimal places
            if (inputValue) {
                const amount = parseFloat(inputValue)
                state.transferState.amount = amount;
                state.transferState.formattedAmount = amount.toFixed(2);
            } else {
                state.transferState.formattedAmount = '';
            }
        },
        setTransferStateDescription(state, action: PayloadAction<string>) {
            state.transferState.description = action.payload;
        },
    },
});

export const { setTextScale, setEnabled, setTransferStateFromAccount, setTransferStateToAccount, setTransferStateAmount, setTransferStateDescription } = appSlice.actions;
export default appSlice.reducer;
