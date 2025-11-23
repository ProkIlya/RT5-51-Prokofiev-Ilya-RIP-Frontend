import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import type { UserState } from './userSlice';
import type { HandlerTripResponse } from '../api/Api'; // Импортируем тип из API

// Используем тип из API вместо кастомного интерфейса
type Trip = HandlerTripResponse;



interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,
};

export const getTrips = createAsyncThunk(
  'trips/getTrips',
  async (filters: { status?: string; date_from?: string; date_to?: string } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsList(filters, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки заявок');
    }
  }
);

export const getTrip = createAsyncThunk(
  'trips/getTrip',
  async (tripId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsDetail(tripId, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки заявки');
    }
  }
);

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ tripId, start_charge }: { tripId: number; start_charge: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsUpdate(tripId, { start_charge }, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка обновления заявки');
    }
  }
);

export const submitTrip = createAsyncThunk(
  'trips/submitTrip',
  async (tripId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsSubmittripUpdate(tripId, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка отправки заявки');
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (tripId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsDelete(tripId, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка удаления заявки');
    }
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload as Trip[];
      })
      .addCase(getTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload as Trip;
      })
      .addCase(getTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;