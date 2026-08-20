// ============================================
// API RESPONSE UTILITY
// Standardizes all API responses
// ============================================

// Type for successful response
interface SuccessResponse {
  success: true;
  message: string;
  data?: any;
  count?: number;
}

// Type for error response
interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
  stack?: string;
}

// Function to send success response
export const successResponse = (
  res: any,
  message: string,
  data?: any,
  statusCode: number = 200
): void => {
  // Create response object
  const response: SuccessResponse = {
    success: true,
    message,
  };

  // Add data if provided
  if (data !== undefined) {
    response.data = data;
    
    // If data is an array, include count
    if (Array.isArray(data)) {
      response.count = data.length;
    }
  }

  // Send response
  res.status(statusCode).json(response);
};

// Function to send error response
export const errorResponse = (
  res: any,
  message: string,
  statusCode: number = 500,
  error?: any
): void => {
  // Create response object
  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Add error details if provided
  if (error !== undefined) {
    response.error = error.message || error;
    
    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
      response.stack = error.stack;
    }
  }

  // Send response
  res.status(statusCode).json(response);
};

// Function to send paginated response
export const paginatedResponse = (
  res: any,
  message: string,
  data: any[],
  page: number,
  limit: number,
  total: number
): void => {
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);
  
  // Calculate if there is a next page
  const hasNextPage = page < totalPages;
  
  // Calculate if there is a previous page
  const hasPrevPage = page > 1;

  // Send paginated response
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

// Export all functions
export default {
  successResponse,
  errorResponse,
  paginatedResponse,
};