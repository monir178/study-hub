import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { auth } from "@/lib/auth";
import { ApiResponse, ApiError, ApiRequestConfig } from "./types";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = "/api") {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        try {
          // Get session from NextAuth v5
          const session = await auth();

          if (session?.user) {
            // Add user information to headers
            config.headers["X-User-Id"] = session.user.id;
            config.headers["X-User-Email"] = session.user.email;
            config.headers["X-User-Role"] = session.user.role;
          }

          // Add timestamp for request tracking
          config.headers["X-Request-Time"] = new Date().toISOString();

          return config;
        } catch (error) {
          console.error("Error in request interceptor:", error);
          return config;
        }
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`,
            response.status,
          );
        }
        return response;
      },
      (error: AxiosError) => {
        // Log errors in development
        if (process.env.NODE_ENV === "development") {
          console.error(
            `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
            error.response?.status,
            error.message,
          );
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Unauthorized - redirect to sign in
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
        } else if (error.response?.status === 403) {
          // Forbidden - show unauthorized page
          if (typeof window !== "undefined") {
            window.location.href = "/unauthorized";
          }
        } else if (error.response?.status === 429) {
          // Rate limiting
          console.warn("Rate limit exceeded. Please try again later.");
        } else if (error.response?.status && error.response.status >= 500) {
          // Server errors
          console.error("Server error occurred. Please try again later.");
        }

        return Promise.reject(error);
      },
    );
  }

  // Generic request handler with error handling
  private async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.request<ApiResponse<T>>({
        method,
        url,
        data,
        ...config,
      });

      // Handle API response format
      if (
        response.data &&
        typeof response.data === "object" &&
        "success" in response.data
      ) {
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || "API request failed");
        }
      }

      // Fallback for non-standard responses
      return response.data as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          success: false,
          error: error.response?.data?.error || error.message,
          message: error.response?.data?.message,
          statusCode: error.response?.status,
        };
        throw apiError;
      }
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<T> {
    return this.request<T>("get", url, undefined, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<T> {
    return this.request<T>("post", url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<T> {
    return this.request<T>("put", url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<T> {
    return this.request<T>("patch", url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<T> {
    return this.request<T>("delete", url, undefined, config);
  }

  // Utility methods
  getBaseURL(): string {
    return this.client.defaults.baseURL || "";
  }

  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  // Method to manually set headers (useful for testing)
  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient();

// Export types for convenience
export type { ApiResponse, ApiError, ApiRequestConfig } from "./types";
