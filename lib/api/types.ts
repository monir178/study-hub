// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Error response type
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// Success response type
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// Request configuration
export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
}
