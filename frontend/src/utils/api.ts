import type { DrivingScenario, CartResponse } from '../types';

const API_BASE = '/api';

// Mock данные для случая, когда бэкенд недоступен
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

export const api = {
  // Получение сценариев с фильтрацией - обновленный тип параметров
  async getScenarios(filters?: { search?: string; type?: string }): Promise<DrivingScenario[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('name', filters.search);
      if (filters?.type) params.append('type', filters.type);
      
      const response = await fetch(`${API_BASE}/scenarios?${params}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API error, using mock data:', error);
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

  // Получение конкретного сценария
  async getScenario(id: number): Promise<DrivingScenario> {
    try {
      const response = await fetch(`${API_BASE}/scenarios/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API error, using mock data:', error);
      const scenario = mockScenarios.find(s => s.id === id);
      if (scenario) return scenario;
      throw new Error('Scenario not found');
    }
  },

  // Получение корзины пустой и неактивной
  async getCart(): Promise<CartResponse> {
    // Всегда возвращаем нули, корзина неактивна
    return { TripID: 0, Count: 0 };
  }
};