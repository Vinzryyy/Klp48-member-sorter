/**
 * Global Error Handler Utility
 * Handles uncaught errors and unhandled promise rejections
 */

// Custom error class for application-specific errors
export class AppError extends Error {
  constructor(message, code = "UNKNOWN_ERROR") {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

// Error codes for better error tracking
export const ErrorCodes = {
  SORTING_ERROR: "SORTING_ERROR",
  EXPORT_ERROR: "EXPORT_ERROR",
  STORAGE_ERROR: "STORAGE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

/**
 * Initialize global error handlers
 * Should be called once at app startup
 */
export const initializeErrorHandlers = () => {
  // Handle uncaught errors
  window.addEventListener("error", (event) => {
    event.preventDefault();
    handleError(event.error || new Error(event.message), "Uncaught Error");
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    handleError(
      event.reason || new Error("Unknown promise rejection"),
      "Unhandled Rejection"
    );
  });
};

/**
 * Centralized error handling function
 * @param {Error} error - The error object
 * @param {string} context - Where the error occurred
 */
const handleError = (error, context = "Unknown") => {
  console.error(`[${context}]`, error);

  // In production, you could send errors to a monitoring service
  if (import.meta.env.PROD) {
    // TODO: Send to Sentry, LogRocket, or similar
    // sendToErrorTracking(error, context);
  }

  // Store critical errors in localStorage for debugging
  storeErrorForDebugging(error, context);
};

/**
 * Store recent errors in localStorage for debugging
 * @param {Error} error - The error to store
 * @param {string} context - Error context
 */
const storeErrorForDebugging = (error, context) => {
  try {
    const errorLog = JSON.parse(localStorage.getItem("errorLog") || "[]");
    const newError = {
      context,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Keep only last 10 errors
    errorLog.unshift(newError);
    if (errorLog.length > 10) errorLog.pop();

    localStorage.setItem("errorLog", JSON.stringify(errorLog));
  } catch (e) {
    // If we can't store the error, just log it
    console.error("Failed to store error for debugging:", e);
  }
};

/**
 * Get stored errors for debugging
 * @returns {Array} Array of stored errors
 */
export const getStoredErrors = () => {
  try {
    return JSON.parse(localStorage.getItem("errorLog") || "[]");
  } catch {
    return [];
  }
};

/**
 * Clear stored errors
 */
export const clearStoredErrors = () => {
  localStorage.removeItem("errorLog");
};

/**
 * Safe wrapper for async operations
 * @param {Function} fn - Async function to execute
 * @param {string} errorMessage - Error message to show on failure
 * @returns {Promise} Result or throws AppError
 */
export const safeAsync = async (fn, errorMessage = "Operation failed") => {
  try {
    return await fn();
  } catch (error) {
    console.error(`[safeAsync] ${errorMessage}:`, error);
    throw new AppError(errorMessage, ErrorCodes.UNKNOWN_ERROR);
  }
};

/**
 * Safe wrapper for localStorage operations
 * @param {Function} fn - Storage operation to execute
 * @param {string} errorMessage - Error message on failure
 * @returns {any} Result or null on failure
 */
export const safeStorage = (fn, errorMessage = "Storage operation failed") => {
  try {
    return fn();
  } catch (error) {
    console.error(`[safeStorage] ${errorMessage}:`, error);
    return null;
  }
};

export default {
  initializeErrorHandlers,
  AppError,
  ErrorCodes,
  safeAsync,
  safeStorage,
  getStoredErrors,
  clearStoredErrors,
};
