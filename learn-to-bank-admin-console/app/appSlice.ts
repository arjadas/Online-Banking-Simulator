import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    enabled: boolean;
    isDarkTheme: boolean;
    textScale: number;
}

export const initialState: AppState = {
    enabled: true,
    isDarkTheme: true,
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
        }
    },
});

export const { setTextScale, setEnabled } = appSlice.actions;
export default appSlice.reducer;
