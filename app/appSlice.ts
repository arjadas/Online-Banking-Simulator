import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransferState = { fromAcc: number | null, toAcc: number | null, amount: number | null, formattedAmount: string, description: string };

interface AppState {
    isDarkTheme: boolean;
    textScale: number;
}

export const initialState: AppState = {
    isDarkTheme: false,
    textScale: 100,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTextScale(state, action: PayloadAction<number>) {
            state.textScale = action.payload;
        },
    },
});

export const { setTextScale } = appSlice.actions;
export default appSlice.reducer;
