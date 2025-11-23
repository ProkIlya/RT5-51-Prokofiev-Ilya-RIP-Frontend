import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import type { UserState } from './userSlice';

interface DraftTripState {
  cartCount: number;
  tripId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: DraftTripState = {
  cartCount: 0,
  tripId: null,
  loading: false,
  error: null,
};

export const getDraftTrip = createAsyncThunk(
  'draftTrip/getDraftTrip',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsScenarioscartList({
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки корзины');
    }
  }
);

export const updateTripScenario = createAsyncThunk(
  'draftTrip/updateTripScenario',
  async ({ tripId, scenarioId, duration }: { tripId: number; scenarioId: number; duration: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsScenariosUpdate(
        tripId, 
        scenarioId, 
        { duration }, 
        {
          secure: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return { response, scenarioId, duration };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка обновления сценария');
    }
  }
);

export const removeScenarioFromTrip = createAsyncThunk(
  'draftTrip/removeScenarioFromTrip',
  async ({ tripId, scenarioId }: { tripId: number; scenarioId: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.tripsScenariosDelete(tripId, scenarioId, {
        secure: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { response, scenarioId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка удаления сценария');
    }
  }
);

const draftTripSlice = createSlice({
  name: 'draftTrip',
  initialState,
  reducers: {
    clearDraft: (state) => {
      state.cartCount = 0;
      state.tripId = null;
      state.error = null;
    },
    updateCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    setTripId: (state, action) => {
      state.tripId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDraftTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDraftTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.cartCount = action.payload.count || 0;
        state.tripId = action.payload.trip_id || null;
      })
      .addCase(getDraftTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeScenarioFromTrip.fulfilled, (state) => {
        // После удаления сценария уменьшаем счетчик
        if (state.cartCount > 0) {
          state.cartCount -= 1;
        }
        // Если сценариев не осталось, сбрасываем tripId
        if (state.cartCount === 0) {
          state.tripId = null;
        }
      });
  },
});

export const { clearDraft, updateCartCount, setTripId } = draftTripSlice.actions;
export default draftTripSlice.reducer;