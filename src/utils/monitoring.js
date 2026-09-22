// Production monitoring and logging utilities
class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      pid: process.pid,
      hostname: process.env.HOSTNAME || 'unknown'
    });
  }

  error(message, meta = {}) {
    console.error(this.formatMessage('error', message, meta));
  }

  warn(message, meta = {}) {
    if (['warn', 'info', 'debug'].includes(this.logLevel)) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message, meta = {}) {
    if (['info', 'debug'].includes(this.logLevel)) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  debug(message, meta = {}) {
    if (this.logLevel === 'debug') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(name) {
    this.metrics.set(name, { start: Date.now() });
  }

  endTimer(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      const duration = Date.now() - metric.start;
      this.metrics.set(name, { ...metric, duration });
      return duration;
    }
    return null;
  }

  getMetrics() {
    const result = {};
    for (const [name, data] of this.metrics.entries()) {
      if (data.duration !== undefined) {
        result[name] = data.duration;
      }
    }
    return result;
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

// Error tracking
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep last 100 errors in memory
  }

  track(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      id: Math.random().toString(36).substr(2, 9)
    };

    this.errors.unshift(errorInfo);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in production format
    logger.error('Application Error', errorInfo);

    return errorInfo.id;
  }

  getRecentErrors(limit = 10) {
    return this.errors.slice(0, limit);
  }

  getErrorById(id) {
    return this.errors.find(error => error.id === id);
  }
}

// Health check utilities
export class HealthChecker {
  constructor() {
    this.checks = new Map();
  }

  addCheck(name, checkFunction) {
    this.checks.set(name, checkFunction);
  }

  async runChecks() {
    const results = {};
    const promises = [];

    for (const [name, checkFn] of this.checks.entries()) {
      promises.push(
        Promise.resolve(checkFn())
          .then(result => ({ name, status: 'healthy', ...result }))
          .catch(error => ({ 
            name, 
            status: 'unhealthy', 
            error: error.message 
          }))
      );
    }

    const checkResults = await Promise.all(promises);
    
    for (const result of checkResults) {
      results[result.name] = result;
    }

    const overallStatus = Object.values(results).every(r => r.status === 'healthy') 
      ? 'healthy' 
      : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    };
  }
}

// Singleton instances
export const logger = new Logger();
export const performanceMonitor = new PerformanceMonitor();
export const errorTracker = new ErrorTracker();
export const healthChecker = new HealthChecker();

// Global error handler
process.on('uncaughtException', (error) => {
  errorTracker.track(error, { type: 'uncaughtException' });
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  errorTracker.track(new Error(reason), { type: 'unhandledRejection', promise });
  logger.error('Unhandled Rejection', { reason, promise });
});