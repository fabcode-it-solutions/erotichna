class Logger {
  constructor(service = "app") {
    this.service = service;
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  // Create formatted log entry
  createLogEntry(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      environment: process.env.NODE_ENV || "unknown",
      ...data,
    };
  }

  // Log info level messages
  info(message, data = {}) {
    const entry = this.createLogEntry("info", message, data);
  }

  // Log warning level messages
  warn(message, data = {}) {
    const entry = this.createLogEntry("warn", message, data);
    console.warn("⚠️", JSON.stringify(entry));
  }

  // Log error level messages
  error(message, error = null, data = {}) {
    const errorData = error
      ? {
          error: error.message,
          stack: error.stack,
          ...data,
        }
      : data;

    const entry = this.createLogEntry("error", message, errorData);
    console.error("🚨", JSON.stringify(entry));
  }

  // Log debug level messages (only in development)
  debug(message, data = {}) {
    if (this.isDevelopment) {
      const entry = this.createLogEntry("debug", message, data);
      console.debug("🐛", JSON.stringify(entry));
    }
  }

  // Log payment-related events
  payment(event, data = {}) {
    const entry = this.createLogEntry("payment", `Payment event: ${event}`, {
      event,
      ...data,
    });
  }

  // Log subscription-related events
  subscription(event, data = {}) {
    const entry = this.createLogEntry(
      "subscription",
      `Subscription event: ${event}`,
      {
        event,
        ...data,
      }
    );
  }

  // Log API request/response
  api(method, path, data = {}) {
    const entry = this.createLogEntry("api", `${method} ${path}`, {
      method,
      path,
      ...data,
    });
  }

  // Log performance metrics
  performance(operation, duration, data = {}) {
    const entry = this.createLogEntry("performance", `${operation} completed`, {
      operation,
      durationMs: duration,
      ...data,
    });
  }

  // Log security events
  security(event, data = {}) {
    const entry = this.createLogEntry("security", `Security event: ${event}`, {
      event,
      ...data,
    });
    console.warn("🔒", JSON.stringify(entry));
  }
}

// Create service-specific loggers
export const createLogger = (service) => new Logger(service);

// Default loggers for common services
export const appLogger = new Logger("app");
export const paymentLogger = new Logger("payment");
export const subscriptionLogger = new Logger("subscription");
export const apiLogger = new Logger("api");
export const securityLogger = new Logger("security");

export default Logger;
