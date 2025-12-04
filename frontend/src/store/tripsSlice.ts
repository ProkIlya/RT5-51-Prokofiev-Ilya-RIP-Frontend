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
  backgroundLoading: boolean; // Фоновая загрузка для polling
  error: string | null;
  lastUpdate: string | null;
  pollCount: number;
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  loading: false,
  backgroundLoading: false,
  error: null,
  lastUpdate: null,
  pollCount: 0,
};

interface GetTripsParams {
  status?: string;
  date_from?: string;
  date_to?: string;
  background?: boolean; // Флаг фоновой загрузки
}

export const getTrips = createAsyncThunk(
  'trips/getTrips',
  async (
    { 
      status, 
      date_from, 
      date_to, 
      background = false 
    }: GetTripsParams = {}, 
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const filters: any = {};
      if (status) filters.status = status;
      if (date_from) filters.date_from = date_from;
      if (date_to) filters.date_to = date_to;

      const response = await api.api.tripsList(filters, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return { 
        data: response, 
        background,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      // Для фоновой загрузки не выкидываем ошибку, чтобы не прерывать polling
      if (background) {
        console.log('Фоновая загрузка не удалась, продолжается polling');
        return { 
          data: [], 
          background,
          timestamp: new Date().toISOString(),
          error: 'background_failed'
        };
      }
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

export const reviewTrip = createAsyncThunk(
  'trips/reviewTrip',
  async ({ tripId, action }: { tripId: number; action: 'complete' | 'reject' }, 
    { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsReviewtripUpdate(tripId, { action }, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка изменения статуса заявки');
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
    },
    incrementPollCount: (state) => {
      state.pollCount += 1;
    },
    resetBackgroundLoading: (state) => {
      state.backgroundLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // getTrips
      .addCase(getTrips.pending, (state, action) => {
        const { background = false } = action.meta.arg as GetTripsParams;
        if (background) {
          state.backgroundLoading = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(getTrips.fulfilled, (state, action) => {
        const { background = false, timestamp } = action.payload as any;
        
        if (background) {
          state.backgroundLoading = false;
          state.pollCount += 1;
        } else {
          state.loading = false;
        }
        
        state.lastUpdate = timestamp;
        state.trips = action.payload.data as Trip[];
      })
      .addCase(getTrips.rejected, (state, action) => {
        const { background = false } = action.meta.arg as GetTripsParams;
        
        if (background) {
          state.backgroundLoading = false;
          state.pollCount += 1;
          console.log('Фоновое обновление пропущено, продолжается polling');
        } else {
          state.loading = false;
          state.error = action.payload as string;
        }
      })
      
      // getTrip
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
      })
      
      // reviewTrip
      .addCase(reviewTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(reviewTrip.fulfilled, (state, action) => {
        state.loading = false;
        // Обновляем поездку в списке
        const updatedTrip = action.payload as Trip;
        const index = state.trips.findIndex(trip => trip.id === updatedTrip.id);
        if (index !== -1) {
          state.trips[index] = updatedTrip;
        }
        // Если это текущая поездка, обновляем ее тоже
        if (state.currentTrip?.id === updatedTrip.id) {
          state.currentTrip = updatedTrip;
        }
      })
      .addCase(reviewTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTrip, incrementPollCount, resetBackgroundLoading } = tripsSlice.actions;
export default tripsSlice.reducer;