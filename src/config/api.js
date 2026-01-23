// Centralized API Configuration
// Uses environment variable with fallback to default

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Incidents
  INCIDENTS: `${API_BASE_URL}/api/incidents`,
  INCIDENT_BY_ID: (id) => `${API_BASE_URL}/api/incidents/${id}`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Socket URL (same as API base URL by default)
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

export default API_BASE_URL;
