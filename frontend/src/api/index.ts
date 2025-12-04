/*import { Api } from './Api';
import { API_BASE_URL } from '../utils/target_config';

// ПРОСТОЙ инстанс API БЕЗ интерцепторов
export const api = new Api({
  baseURL: API_BASE_URL,
});

export default api;*/

import { Api, HttpClient } from './Api';
import { API_BASE_URL } from '../utils/target_config';

// Создаем экземпляр HttpClient с настройками
const httpClient = new HttpClient({
  baseURL: API_BASE_URL,
});

// Создаем экземпляр Api с HttpClient
export const api = new Api(httpClient);

export default api;