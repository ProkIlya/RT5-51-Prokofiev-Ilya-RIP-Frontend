import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import type { UserState } from './userSlice'; // Импортируем тип
import type { HandlerScenarioResponse } from '../api/Api'; // Импортируем тип из API

// Используем тип из API вместо кастомного интерфейса
type Scenario = HandlerScenarioResponse;



interface ScenariosState {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  loading: boolean;
  error: string | null;
}

const initialState: ScenariosState = {
  scenarios: [],
  currentScenario: null,
  loading: false,
  error: null,
};

export const getScenarios = createAsyncThunk(
  'scenarios/getScenarios',
  async (filters: { name?: string; type?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.api.scenariosList(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки сценариев');
    }
  }
);

export const getScenario = createAsyncThunk(
  'scenarios/getScenario',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.api.scenariosDetail(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки сценария');
    }
  }
);

export const addScenarioToTrip = createAsyncThunk(
  'scenarios/addToTrip',
  async ({ scenarioId, duration }: { scenarioId: number; duration: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }

      const response = await api.api.scenariosAddToTripCreate(
        scenarioId,
        { duration },
        {
          secure: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка добавления в заявку');
    }
  }
);

const scenariosSlice = createSlice({
  name: 'scenarios',
  initialState,
  reducers: {
    clearCurrentScenario: (state) => {
      state.currentScenario = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScenarios.pending, (state) => {
        state.loading = true;
      })
      .addCase(getScenarios.fulfilled, (state, action) => {
        state.loading = false;
        state.scenarios = action.payload as Scenario[];
      })
      .addCase(getScenarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getScenario.pending, (state) => {
        state.loading = true;
      })
      .addCase(getScenario.fulfilled, (state, action) => {
        state.loading = false;
        state.currentScenario = action.payload as Scenario;
      })
      .addCase(getScenario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentScenario } = scenariosSlice.actions;
export default scenariosSlice.reducer;