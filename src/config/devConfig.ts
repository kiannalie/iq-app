// Development configuration
// Set DEV_MODE to true to use mock data and avoid API calls

export const DEV_CONFIG = {
  // Toggle between dev mode (mock data) and production mode (real API)
  USE_MOCK_DATA: true, // Change to false when you want to use real API

  // Cache settings
  CACHE_DURATION_MS: 1000 * 60 * 30, // 30 minutes

  // API settings
  ENABLE_API_LOGGING: true,
};

// Helper to check if we should use mock data
export const shouldUseMockData = (): boolean => {
  return DEV_CONFIG.USE_MOCK_DATA;
};
