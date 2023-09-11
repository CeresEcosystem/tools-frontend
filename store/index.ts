import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import tokenReducer from '@store/tokens/token_slice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tokens'],
};

const rootReducer = combineReducers({
  tokens: tokenReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);
