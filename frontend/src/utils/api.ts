import type { DrivingScenario, CartResponse } from '../types';
import { API_BASE_URL, IMAGE_BASE_URL} from './target_config';
import { getApiBaseUrl } from '../config/api';


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
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
};




export const api = {
  async getScenarios(filters?: { search?: string; type?: string }): Promise<DrivingScenario[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('name', filters.search);
      if (filters?.type) params.append('type', filters.type);
      
      const url = filters 
        ? `${API_BASE}/scenarios?${params}`
        : `${API_BASE}/scenarios`;
      
      console.log('API Request:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      // Обработка разных форматов ответа как у одногруппника
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.scenarios)) {
        return data.scenarios;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('Unexpected API response format:', data);
        return [];
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback на mock данные
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
      const response = await fetch(`${API_BASE_URL}/scenarios/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.scenario || data;
    } catch (error) {
      console.error('API Error:', error);
      // Fallback на mock данные
      const scenario = mockScenarios.find(s => s.id === id);
      if (scenario) return scenario;
      throw new Error('Scenario not found');
    }
  },

  async getCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/scenarioscart`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        trip_id: data.trip_id || data.TripID || 0,
        count: data.count || data.Count || 0
      };
    } catch (error) {
      console.error('API Error:', error);
      return { trip_id: 0, count: 0 };
    }
  }
};