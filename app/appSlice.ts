import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransferState = { fromAcc: number | null, toAcc: number | null, amount: number | null, formattedAmount: string, description: string };

interface AppState {
    isDarkTheme: boolean;
    textScale: number;
    inTransactionFlow: boolean;
}

export const initialState: AppState = {
    isDarkTheme: false,
    textScale: 16,
    inTransactionFlow: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTextScale(state, action: PayloadAction<number>) {
            state.textScale = action.payload;
        },
        setInTransactionFlow(state, action: PayloadAction<boolean>) {
            state.inTransactionFlow = action.payload;
        },
    },
});

export const { setTextScale, setInTransactionFlow } = appSlice.actions;
export default appSlice.reducer;
