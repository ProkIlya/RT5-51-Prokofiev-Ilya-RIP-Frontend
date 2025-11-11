import type { DrivingScenario, CartResponse } from '../types';

// Умная функция для определения базового URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined) {
    if (import.meta.env.DEV) {
      // DEV режим
      return 'https://192.168.56.1:3000/api';
    } else {
      // BUILD режим
      return 'http://192.168.56.1:8080/api';
    }
  }
  // PWA везде
  return '/api';
};
const API_BASE = getApiBaseUrl();

// Mock данные (оставляем ваши существующие)
const mockScenarios: DrivingScenario[] = [
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

// НОВАЯ ФУНКЦИЯ: Умный fetch для обхода CORS
/*const tauriFetch = async (url: string, options: RequestInit = {}) => {
  const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined;
  
  if (isTauri) {
    // Для Tauri используем полный URL и добавляем заголовки для CORS
    const fullUrl = url.startsWith('http') ? url : `http://192.168.56.1:8080${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('Tauri fetch error:', error);
      throw error;
    }
  } else {
    // Для веб-версии используем обычный fetch
    return fetch(url, options);
  }
};*/

const tauriFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    mode: 'cors',  
    credentials: 'omit'  
  });
};


export const api = {
  async getScenarios(filters?: { search?: string; type?: string }): Promise<DrivingScenario[]> {
    try {
      console.log('Текущий API_BASE:', API_BASE);
      console.log('Tauri detected:', typeof window !== 'undefined' && !!(window as any).__TAURI__);
      
      const params = new URLSearchParams();
      if (filters?.search) params.append('name', filters.search);
      if (filters?.type) params.append('type', filters.type);
      
      const url = `${API_BASE}/scenarios?${params}`;
      console.log('Запрос к API:', url);
      
      // ЗАМЕНА: используем tauriFetch вместо обычного fetch
      const response = await tauriFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Получены данные с API:', data);
        return data;
      } else {
        console.log('API вернул ошибку, используем mock данные. Статус:', response.status);
        throw new Error('API недоступен');
      }
      
    } catch (error) {
      console.log('Используются mock данные. Ошибка:', error);
      let filtered = mockScenarios;
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
    }
  },

  async getScenario(id: number): Promise<DrivingScenario> {
    try {
      console.log('Запрос сценария по ID:', id);
      // ЗАМЕНА: используем tauriFetch вместо обычного fetch
      const response = await tauriFetch(`${API_BASE}/scenarios/${id}`);
      
      if (response.ok) {
        return await response.json();
      } else {
        console.log('API вернул ошибку, используем mock данные. Статус:', response.status);
        throw new Error('API недоступен');
      }
      
    } catch (error) {
      console.error('API error, using mock data:', error);
      const scenario = mockScenarios.find(s => s.id === id);
      if (scenario) return scenario;
      throw new Error('Scenario not found');
    }
  },

  async getCart(): Promise<CartResponse> {
    try {
      console.log('Запрос корзины по адресу:', `${API_BASE}/trips/scenarioscart`);
      // ЗАМЕНА: используем tauriFetch вместо обычного fetch
      const response = await tauriFetch(`${API_BASE}/trips/scenarioscart`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Данные корзины:', data);
        
        return {
          trip_id: data.trip_id || data.TripID || 0,
          count: data.count || data.Count || 0
        };
      } else {
        console.log('Корзина недоступна, используем fallback. Статус:', response.status);
        return { trip_id: 0, count: 0 };
      }
      
    } catch (error) {
      console.error('API error for cart, using fallback:', error);
      return { trip_id: 0, count: 0 };
    }
  }
};