/**
 * Response Helpers — konsisten untuk semua endpoint
 *
 * Semua response menggunakan format yang sama sehingga
 * frontend mudah memparsnya.
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export function ok<T>(data: T, message?: string): ApiSuccess<T> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function fail(error: string, details?: unknown): ApiError {
  return { success: false, error, ...(details ? { details } : {}) };
}
