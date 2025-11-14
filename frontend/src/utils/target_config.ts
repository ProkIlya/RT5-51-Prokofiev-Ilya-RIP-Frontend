const target_tauri = true //  true для Tauri, false для браузера
;
export const API_BASE_URL = target_tauri 
  ? 'http://192.168.56.1:8080/api'  // Для Tauri - прямой IP
  : '/api';                      // Для веб - proxy

export const IMAGE_BASE_URL = target_tauri
  ? 'http://192.168.56.1:9000'  // Для Tauri - прямой IP
  : '/img-proxy';               // Для веб - proxy

export const BASE_PATH = target_tauri 
  ? ''
  : '';