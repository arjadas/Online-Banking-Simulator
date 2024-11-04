import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPrevContactResult } from './routes/app.paySomeone';
import { RecipientAddress } from './service/transactionsService';

export type TransferState = { fromAcc: number | null, toAcc: number | null, amount: number | null, formattedAmount: string, description: string };
export type TransactionFlow = { fromAcc: number | null, toAcc: number | null, userPrevContact: UserPrevContactResult | null, enabled: boolean, successful: boolean, recipientAddress: RecipientAddress, addressType: string, modifiedAddress: boolean };
export const blankRecipientAddress: RecipientAddress = {
    accountName: '',
    acc: -1,
    bsb: -1,
    payId: '',
    billerCode: -1,
    crn: -1
}
export const blankTransactionFlow: TransactionFlow = { fromAcc: null, toAcc: null, userPrevContact: null, enabled: false, successful: false, recipientAddress: blankRecipientAddress, addressType: 'acc-bsb', modifiedAddress: false };

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

export const asyncResetTransactionFlow = createAsyncThunk(
    'app/resetTransactionFlow',
    async (path: string, { dispatch }) => {
        dispatch(resetTransactionFlow());
        return path;
    }
);

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTextScale(state, action: PayloadAction<number>) {
            state.textScale = action.payload;
        },
        setTransactionFlow(state, action: PayloadAction<TransactionFlow>) {
            state.transactionFlow = action.payload;
        },
        resetTransactionFlow(state) {
            state.transactionFlow = blankTransactionFlow;
        },
        setFromAcc(state, action: PayloadAction<number>) {
            state.transactionFlow.fromAcc = action.payload;
        },
        setToAcc(state, action: PayloadAction<number>) {
            state.transactionFlow.toAcc = action.payload;
        },
        setUserPrevContact(state, action: PayloadAction<UserPrevContactResult | null>) {
            state.transactionFlow.userPrevContact = action.payload;
        },
        setRecipientAddress(state, action: PayloadAction<RecipientAddress>) {
            state.transactionFlow.recipientAddress = action.payload;
        },
        setAddressType(state, action: PayloadAction<string>) {
            state.transactionFlow.addressType = action.payload;
            state.transactionFlow.modifiedAddress = true;
        },
        setModifiedAddress(state, action: PayloadAction<boolean>) {
            state.transactionFlow.modifiedAddress = action.payload;
        },
    },
});

export const { setTextScale, setTransactionFlow, setFromAcc, setToAcc, setRecipientAddress, resetTransactionFlow, setUserPrevContact, setAddressType, setModifiedAddress } = appSlice.actions;
export default appSlice.reducer;