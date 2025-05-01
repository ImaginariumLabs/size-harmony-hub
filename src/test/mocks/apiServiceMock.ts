import { vi } from 'vitest';

// Mock data for API services
export const mockApiData = {
  openai: {
    total: 123.45,
    change: 10.5,
    changeType: 'increase',
    usageData: [
      { date: '2025-05-01', value: 20.5 },
      { date: '2025-05-02', value: 25.3 },
    ],
  },
  claude: {
    total: 98.76,
    change: 5.2,
    changeType: 'decrease',
    usageData: [
      { date: '2025-05-01', value: 15.2 },
      { date: '2025-05-02', value: 10.0 },
    ],
  },
  google: {
    total: 45.67,
    change: 2.1,
    changeType: 'increase',
    usageData: [
      { date: '2025-05-01', value: 8.5 },
      { date: '2025-05-02', value: 10.6 },
    ],
  },
  github: {
    total: 12.34,
    change: 1.0,
    changeType: 'no-change',
    usageData: [
      { date: '2025-05-01', value: 5.5 },
      { date: '2025-05-02', value: 5.5 },
    ],
  },
};

// Create a mock for the enhancedApiService
export const enhancedApiServiceMock = {
  fetchAllApiData: vi.fn().mockResolvedValue(mockApiData),
  fetchApiData: vi.fn().mockImplementation((provider) => {
    return Promise.resolve(mockApiData[provider] || {});
  }),
  fetchApiUsage: vi.fn().mockResolvedValue({
    daily: [
      { date: '2025-05-01', value: 50 },
      { date: '2025-05-02', value: 60 },
    ],
    weekly: [
      { date: '2025-05-01', value: 300 },
      { date: '2025-05-08', value: 350 },
    ],
    monthly: [
      { date: '2025-05-01', value: 1200 },
      { date: '2025-06-01', value: 1500 },
    ],
  }),
  fetchProviderHealth: vi.fn().mockResolvedValue({
    status: 'healthy',
    uptime: 99.9,
    responseTime: 250,
    errorRate: 0.1,
    lastChecked: '2025-05-02T12:00:00Z',
  }),
};

// Mock the enhancedApiService module
vi.mock('../../services/enhancedApiService', () => ({
  fetchAllApiData: enhancedApiServiceMock.fetchAllApiData,
  fetchApiData: enhancedApiServiceMock.fetchApiData,
  fetchApiUsage: enhancedApiServiceMock.fetchApiUsage,
  fetchProviderHealth: enhancedApiServiceMock.fetchProviderHealth,
}));

export default enhancedApiServiceMock;
