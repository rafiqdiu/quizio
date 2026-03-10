import { Platform } from 'react-native';

// Set EXPO_PUBLIC_API_BASE_URL to force an exact API endpoint.
// Example: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.50:8000/api
const explicitApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const resolveApiBaseUrl = () => {
  if (explicitApiBaseUrl) {
    return explicitApiBaseUrl;
  }

  // Android emulator cannot reach host machine via localhost.
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }

  // iOS simulator + web (same machine)
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = resolveApiBaseUrl();

// Network configuration
export const API_TIMEOUT = 15000; // 15 seconds

// You can create an axios instance with default config like:
// import axios from 'axios';
// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: API_TIMEOUT,
// });
