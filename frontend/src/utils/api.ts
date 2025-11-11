import type { DrivingScenario, CartResponse } from '../types';
//import { dest_api, dest_img } from './target_config';


// функция для определения окружения
const getEnvironment = () => {
  // Проверяем, находимся ли мы в Tauri
  const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI__;
  
  if (!isTauri) {
    return 'browser'; // Обычный браузер
  }
  
  // В Tauri - определяем dev или build по URL
  if (typeof window !== 'undefined' && window.location) {
    const currentUrl = window.location.href;
    
    // Если URL содержит порт 3000 - это dev режим
    if (currentUrl.includes(':3000')) {
      return 'tauri-dev';
    }
    
    // Если URL содержит tauri:// или file:// - это build режим
    if (currentUrl.startsWith('tauri://') || currentUrl.startsWith('file://')) {
      return 'tauri-build';
    }
  }
  
  // Fallback - считаем что это build режим
  return 'tauri-build';
};

// функция для определения базового URL
const getApiBaseUrl = () => {
  const environment = getEnvironment();
  
  console.log('Detected environment:', environment);
  
  switch (environment) {
    case 'tauri-dev':
      // Tauri dev режим: используем Vite прокси через порт 3000
      return 'http://192.168.56.1:8080/api';
    
    case 'tauri-build':
      // Tauri build режим: прямой доступ к API через порт 8080
      return 'http://192.168.56.1:8080/api';
    
    case 'browser':
    default:
      // Обычный браузер: прокси через Vite
      return '/api';
  }
};

const API_BASE = getApiBaseUrl();
// Mock данные
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

// Функция для обработки URL изображений
export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '/default-scenario.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  } else {
    const environment = getEnvironment();
    if (environment === 'tauri-build') {
      // В Tauri build: прямой доступ к MinIO
      return `http://192.168.56.1:9000${imagePath}`;
    } else {
      // В браузере и Tauri dev: через прокси
      return `/img-proxy${imagePath}`;
    }
  }
};



const smartFetch = async (url: string, options: RequestInit = {}) => {
  const environment = getEnvironment();
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  console.log('Fetch details:', {
    fullUrl,
    environment,
    API_BASE,
    originalUrl: url
  });
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // В Tauri используем cors, в браузере - same-origin
    mode: environment !== 'browser' ? 'cors' : 'same-origin',
    credentials: 'omit'
  };

  try {
    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const api = {
  async getScenarios(filters?: { search?: string; type?: string }): Promise<DrivingScenario[]> {
    try {
      const environment = getEnvironment();
      console.log('API Configuration:', {
        API_BASE,
        environment
      });
      
      const params = new URLSearchParams();
      if (filters?.search) params.append('name', filters.search);
      if (filters?.type) params.append('type', filters.type);
      
      const url = `/scenarios?${params}`;
      console.log('Request path:', url);
      
      const response = await smartFetch(url, { method: 'GET' });
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        return data;
      } else {
        console.log('API returned error, using mock data. Status:', response.status);
        throw new Error('API недоступен');
      }
      
    } catch (error) {
      console.log('Using mock data. Error:', error);
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
      const response = await smartFetch(`/scenarios/${id}`);
      
      if (response.ok) {
        return await response.json();
      } else {
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
      const response = await smartFetch(`/trips/scenarioscart`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          trip_id: data.trip_id || data.TripID || 0,
          count: data.count || data.Count || 0
        };
      } else {
        return { trip_id: 0, count: 0 };
      }
    } catch (error) {
      console.error('API error for cart:', error);
      return { trip_id: 0, count: 0 };
    }
  },

  // Функция для отладки - проверка окружения
  debugEnvironment() {
    return {
      environment: getEnvironment(),
      API_BASE,
      currentUrl: typeof window !== 'undefined' && window.location ? window.location.href : 'undefined',
      isTauri: typeof window !== 'undefined' && !!(window as any).__TAURI__
    };
  }
};