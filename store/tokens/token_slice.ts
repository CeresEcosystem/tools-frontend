import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TokenState {
  favoriteTokens: string[];
}

const initialState: TokenState = {
  favoriteTokens: [],
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteTokens.push(action.payload);
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteTokens = state.favoriteTokens.filter(
        (token) => token !== action.payload
      );
    },
  },
});

export const { addToFavorites, removeFromFavorites } = tokenSlice.actions;

export default tokenSlice.reducer;
