import { API_BASE_URL, IMAGE_BASE_URL } from '../utils/target_config';

export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

export const getImageBaseUrl = (): string => {
  return IMAGE_BASE_URL;
};

// Для Tauri - прямой IP, для веба - пустая строка (относительные пути)
export const getTauriApiBaseUrl = (): string => {
  return 'http://192.168.56.1:8080';
};