// API utility functions with error handling

// Detect if we're running on localhost or in production
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname === '0.0.0.0');

// Use relative URLs for production deployments, localhost URL for local development
const API_BASE_URL = isLocalhost
  ? (process.env.REACT_APP_API_URL || 'http://localhost:5001')
  : ''; // Use relative URLs for production (proxy will handle backend)

// Log the configuration for debugging
console.log('API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  href: typeof window !== 'undefined' ? window.location.href : 'server',
  isLocalhost,
  API_BASE_URL,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  finalApiUrl: `${API_BASE_URL}/api/courses/student/published-courses`
});

// Generic fetch wrapper with error handling
export const fetchWithErrorHandling = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend server may be unavailable');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please check if the server is running.');
    }
    
    throw error;
  }
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    await fetchWithErrorHandling(`${API_BASE_URL}/api/health`);
    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return false;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTO_LOGIN: `${API_BASE_URL}/api/v1/auto-login`,
  PUBLISHED_COURSES: `${API_BASE_URL}/api/courses/student/published-courses`,
  MY_COURSES: `${API_BASE_URL}/api/user/student/my-courses`,
  IIM_PREDICTOR: (userId) => `${API_BASE_URL}/api/v2/iim-predictor/${userId}`,
};

// Helper function to retry API calls
const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`API call attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Course API functions
export const fetchPublishedCourses = async () => {
  const apiCall = async () => {
    console.log('Fetching courses from:', API_ENDPOINTS.PUBLISHED_COURSES);
    const data = await fetchWithErrorHandling(API_ENDPOINTS.PUBLISHED_COURSES);
    console.log('Courses fetched successfully:', data);
    return data;
  };

  try {
    // In production (non-localhost), retry API calls as backend might be starting up
    if (!isLocalhost) {
      return await retryApiCall(apiCall, 3, 2000);
    } else {
      return await apiCall();
    }
  } catch (error) {
    console.error('Error fetching published courses:', error);
    console.error('API_BASE_URL:', API_BASE_URL);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    throw error;
  }
};

export const fetchMyCourses = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const data = await fetchWithErrorHandling(API_ENDPOINTS.MY_COURSES, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching my courses:', error);
    throw error;
  }
};
