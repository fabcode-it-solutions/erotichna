import { appLogger } from "./logger";

// Custom error classes
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.statusCode = 400;
  }
}

export class PaymentError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = "PaymentError";
    this.code = code;
    this.statusCode = 402;
  }
}

export class SubscriptionError extends Error {
  constructor(message, subscriptionId = null) {
    super(message);
    this.name = "SubscriptionError";
    this.subscriptionId = subscriptionId;
    this.statusCode = 409;
  }
}

export class NotFoundError extends Error {
  constructor(message, resource = null) {
    super(message);
    this.name = "NotFoundError";
    this.resource = resource;
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

// Error handler for API routes
export const handleApiError = (error, context = {}) => {
  // Log the error with context
  appLogger.error("API Error", error, {
    ...context,
    userAgent: context.userAgent || "unknown",
    ip: context.ip || "unknown",
  });

  // Determine response based on error type
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: "Validation failed",
      details: error.message,
      field: error.field,
      statusCode: 400,
    };
  }

  if (error instanceof PaymentError) {
    return {
      success: false,
      error: "Payment failed",
      details: error.message,
      code: error.code,
      statusCode: 402,
    };
  }

  if (error instanceof SubscriptionError) {
    return {
      success: false,
      error: "Subscription error",
      details: error.message,
      subscriptionId: error.subscriptionId,
      statusCode: 409,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      success: false,
      error: "Resource not found",
      details: error.message,
      resource: error.resource,
      statusCode: 404,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      success: false,
      error: "Unauthorized",
      details: error.message,
      statusCode: 401,
    };
  }

  // For production, don't expose internal error details
  const isProduction = process.env.NODE_ENV === "production";

  return {
    success: false,
    error: "Internal server error",
    details: isProduction ? "An unexpected error occurred" : error.message,
    statusCode: 500,
  };
};

// Async error wrapper for API routes
export const asyncHandler = (fn) => {
  return async (request, context = {}) => {
    try {
      return await fn(request, context);
    } catch (error) {
      const errorResponse = handleApiError(error, context);
      return new Response(JSON.stringify(errorResponse), {
        status: errorResponse.statusCode,
        headers: {
          "Content-Type": "application/json",
          "X-Error-Handled": "true",
        },
      });
    }
  };
};

// Validate required fields
export const validateRequired = (data, requiredFields) => {
  const missing = [];

  for (const field of requiredFields) {
    if (
      !data[field] ||
      (typeof data[field] === "string" && !data[field].trim())
    ) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(", ")}`,
      missing[0]
    );
  }
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format", "email");
  }
};

// Validate user ID format (MongoDB ObjectId)
export const validateUserId = (userId) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(userId)) {
    throw new ValidationError("Invalid user ID format", "userId");
  }
};

// Safe JSON parse with error handling
export const safeParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    appLogger.warn("JSON parse failed", { jsonString, error: error.message });
    return defaultValue;
  }
};

// Rate limiting helper
export const checkRateLimit = (
  identifier,
  maxRequests = 10,
  windowMs = 60000
) => {
  // In production, you'd want to use Redis or a proper rate limiting service
  // This is a simple in-memory implementation for demonstration
  const now = Date.now();
  const windowStart = now - windowMs;

  // This would be stored in Redis in production
  const requests = global.rateLimitStore?.[identifier] || [];

  // Clean old requests
  const recentRequests = requests.filter((time) => time > windowStart);

  if (recentRequests.length >= maxRequests) {
    throw new Error(
      `Rate limit exceeded: ${maxRequests} requests per ${windowMs}ms`
    );
  }

  // Store the request
  if (!global.rateLimitStore) global.rateLimitStore = {};
  global.rateLimitStore[identifier] = [...recentRequests, now];

  return true;
};

export default {
  ValidationError,
  PaymentError,
  SubscriptionError,
  NotFoundError,
  UnauthorizedError,
  handleApiError,
  asyncHandler,
  validateRequired,
  validateEmail,
  validateUserId,
  safeParse,
  checkRateLimit,
};
