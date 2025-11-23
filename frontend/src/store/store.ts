import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import userReducer from './userSlice';
import scenariosReducer from './scenariosSlice';
import tripsReducer from './tripsSlice';
import draftTripReducer from './draftTripSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    user: userReducer,
    scenarios: scenariosReducer,
    trips: tripsReducer,
    draftTrip: draftTripReducer,
  },
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;