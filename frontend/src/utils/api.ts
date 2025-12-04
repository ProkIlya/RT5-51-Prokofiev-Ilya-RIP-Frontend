import type { DrivingScenario, CartResponse } from '../types';
import { IMAGE_BASE_URL } from './target_config';
import { getApiBaseUrl } from '../config/confapi';

// Mock данные
const SCENARIOS_MOCK: DrivingScenario[] = [
  {
    id: 1,
    name: "Городская езда",
    description: "Езда по городу с частыми остановками",
    status: "действует",
    image_url: "",
    type: "дорога",
    system_consumption: 0,
    speed: 60,
    aero_coeff: 0.3,
    rolling_coeff: 0.01
  },
  {
    id: 2,
    name: "Трасса",
    description: "Движение по загородной трассе",
    status: "действует",
    image_url: "",
    type: "дорога", 
    system_consumption: 0,
    speed: 110,
    aero_coeff: 0.25,
    rolling_coeff: 0.008
  },
  {
    id: 3,
    name: "Кондиционер",
    description: "Работа систем комфорта",
    status: "действует",
    image_url: "",
    type: "комфорт",
    system_consumption: 2.5,
    speed: 0,
    aero_coeff: 0,
    rolling_coeff: 0
  }
];

// Проверяем, работаем ли мы в Tauri
const isTauri = typeof window !== 'undefined' && window.__TAURI__ !== undefined;

const API_BASE = getApiBaseUrl();

// Функция для обработки URL изображений
export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '/default-scenario.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  } else {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
};

export const getScenarios = async (filters?: { search?: string; type?: string }): Promise<DrivingScenario[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('name', filters.search);
    if (filters?.type) queryParams.append('type', filters.type);
    
    const url = filters 
      ? `${API_BASE}/scenarios?${queryParams}`
      : `${API_BASE}/scenarios`;
    
    console.log('API Request:', url);
    
    let response: Response;

    if (isTauri) {
      // Для Tauri используем плагин HTTP
      const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      response = await tauriFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Для веба используем стандартный fetch
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // Обработка разных форматов ответа
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.scenarios)) {
      return data.scenarios;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Unexpected API response format, using mock data');
      return filterMockScenarios(SCENARIOS_MOCK, filters);
    }
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    return filterMockScenarios(SCENARIOS_MOCK, filters);
  }
};

export const getScenario = async (id: number): Promise<DrivingScenario> => {
  try {
    let response: Response;

    if (isTauri) {
      const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      response = await tauriFetch(`${API_BASE}/scenarios/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      response = await fetch(`${API_BASE}/scenarios/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.scenario || data;
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    const scenario = SCENARIOS_MOCK.find(s => s.id === id);
    if (scenario) return scenario;
    throw new Error('Scenario not found');
  }
};

export const getCart = async (): Promise<CartResponse> => {
  try {
    let response: Response;

    if (isTauri) {
      const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      response = await tauriFetch(`${API_BASE}/trips/scenarioscart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      response = await fetch(`${API_BASE}/trips/scenarioscart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return {
      trip_id: data.trip_id || data.TripID || 0,
      count: data.count || data.Count || 0
    };
  } catch (error) {
    console.warn('Failed to get cart count:', error);
    return { trip_id: 0, count: 0 };
  }
};

const filterMockScenarios = (scenarios: DrivingScenario[], filters?: { search?: string; type?: string }): DrivingScenario[] => {
  let filtered = scenarios;

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.description.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.type) {
    filtered = filtered.filter(s => s.type === filters.type);
  }

  return filtered;
};