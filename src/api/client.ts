import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.planetkebabafrica.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // 1s, 2s, 4s

// Helper to determine if error is retryable
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error
    return true;
  }
  // Retry on 5xx server errors
  return error.response.status >= 500 && error.response.status < 600;
};

// Delay helper
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor for retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    
    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry count
    config._retryCount = config._retryCount || 0;

    // Check if we should retry
    if (config._retryCount < MAX_RETRIES && isRetryableError(error)) {
      config._retryCount++;
      
      // Wait before retrying
      const delayMs = RETRY_DELAYS[config._retryCount - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
      await delay(delayMs);

      // Retry the request
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
