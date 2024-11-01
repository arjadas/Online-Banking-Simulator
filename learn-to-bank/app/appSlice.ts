import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPrevContactResult } from './routes/app.paySomeone';

export type TransferState = { fromAcc: number | null, toAcc: number | null, amount: number | null, formattedAmount: string, description: string };
export type TransactionFlow = { fromAcc: number | null, toAcc: number | null, fromAccPaySomeone: number | null, userPrevContact: UserPrevContactResult | null, enabled: boolean, successful: boolean };
export const blankTransactionFlow: TransactionFlow = { fromAcc: null, toAcc: null, fromAccPaySomeone: null, userPrevContact: null, enabled: false, successful: false };

interface AppState {
    isDarkTheme: boolean;
    textScale: number;
    transactionFlow: TransactionFlow;
}

export const initialState: AppState = {
    isDarkTheme: false,
    textScale: 16,
    transactionFlow: blankTransactionFlow,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTextScale(state, action: PayloadAction<number>) {
            state.textScale = action.payload;
        },
        setInTransactionFlow(state, action: PayloadAction<TransactionFlow>) {
            state.transactionFlow = action.payload;
        },
    },
});

export const { setTextScale, setInTransactionFlow: setTransactionFlow } = appSlice.actions;
export default appSlice.reducer;
