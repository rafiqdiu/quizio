import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Set EXPO_PUBLIC_API_BASE_URL to force an exact API endpoint.
// Example: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.50:8000/api
const explicitApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function resolveExpoHostApiBaseUrl(): string | null {
  const hostUri =
    (Constants as any)?.expoConfig?.hostUri ||
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any)?.manifest?.debuggerHost ||
    null;

  if (!hostUri || typeof hostUri !== 'string') {
    return null;
  }

  const host = hostUri.split(':')[0];
  if (!host) {
    return null;
  }

  const isLoopbackHost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  if (isLoopbackHost) {
    return null;
  }

  return `http://${host}:8000/api`;
}

const resolveApiBaseUrl = () => {
  if (explicitApiBaseUrl) {
    return explicitApiBaseUrl;
  }

  const expoHostApiBaseUrl = resolveExpoHostApiBaseUrl();

  // Web runs in the browser on the same machine.
  if (Platform.OS === 'web') {
    return 'http://localhost:8000/api';
  }

  // Expo on real devices/emulators often exposes host LAN IP via hostUri.
  if (expoHostApiBaseUrl) {
    return expoHostApiBaseUrl;
  }

  // Android emulator special host mapping to local machine.
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }

  // iOS simulator (same machine as backend).
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
