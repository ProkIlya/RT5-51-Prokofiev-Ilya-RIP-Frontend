import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';

// Всегда включаем DevTools для демонстрации
export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;