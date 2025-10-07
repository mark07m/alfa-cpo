import { ApiResponse, PaginationMeta } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message?: string,
    pagination?: PaginationMeta
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      ...(message && { message }),
      ...(pagination && { pagination }),
    };
  }

  static error(
    error: string,
    message?: string,
    statusCode?: number
  ): ApiResponse {
    return {
      success: false,
      error,
      ...(message && { message }),
      ...(statusCode && { statusCode }),
    };
  }

  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message?: string
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      pagination,
      ...(message && { message }),
    };
  }

  static created<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Resource created successfully',
    };
  }

  static updated<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Resource updated successfully',
    };
  }

  static deleted(message?: string): ApiResponse {
    return {
      success: true,
      data: null,
      message: message || 'Resource deleted successfully',
    };
  }
}
