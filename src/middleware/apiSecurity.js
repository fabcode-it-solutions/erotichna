import { NextResponse } from 'next/server';
import { csrfMiddleware } from './csrf';
import { rateLimitMiddleware } from './rateLimiter';
import { logger, performanceMonitor, errorTracker } from '@/utils/monitoring';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Security wrapper for API routes
export function withSecurity(handler, options = {}) {
  return async function secureHandler(request, context) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    try {
      // Skip security for GET requests to public endpoints
      const isPublicGet = request.method === 'GET' && options.publicGet;
      
      if (!isPublicGet) {
        // Apply CSRF protection for state-changing requests
        const csrfError = csrfMiddleware(request);
        if (csrfError) {
          logger.warn('CSRF token validation failed', {
            requestId,
            method: request.method,
            url: request.url
          });
          return csrfError;
        }

        // Apply rate limiting
        const rateLimitOptions = options.rateLimit || { maxRequests: 100, windowMs: 15 * 60 * 1000 };
        const rateLimitError = rateLimitMiddleware(request, rateLimitOptions);
        if (rateLimitError) {
          logger.warn('Rate limit exceeded', {
            requestId,
            method: request.method,
            url: request.url
          });
          return rateLimitError;
        }
      }

      // Add security headers
      const response = await handler(request, context);
      
      if (response instanceof NextResponse) {
        // Add security headers
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        if (process.env.NODE_ENV === 'production') {
          response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
      }

      const duration = Date.now() - startTime;
      logger.info('API request completed', {
        requestId,
        method: request.method,
        url: request.url,
        duration,
        status: response.status
      });

      return response;
    } catch (error) {
      const errorId = errorTracker.track(error, {
        requestId,
        method: request.method,
        url: request.url
      });

      logger.error('API request failed', {
        requestId,
        errorId,
        method: request.method,
        url: request.url,
        error: error.message
      });

      return NextResponse.json(
        {
          error: 'Internal server error',
          requestId,
          ...(process.env.NODE_ENV === 'development' && { details: error.message })
        },
        { status: 500 }
      );
    }
  };
}

// Specific security configurations for different route types
export const authSecurity = {
  rateLimit: { maxRequests: 5, windowMs: 15 * 60 * 1000 } // Stricter for auth
};

export const paymentSecurity = {
  rateLimit: { maxRequests: 10, windowMs: 15 * 60 * 1000 } // Moderate for payments
};

export const adminSecurity = {
  rateLimit: { maxRequests: 50, windowMs: 15 * 60 * 1000 } // Higher for admin
};

export const publicSecurity = {
  publicGet: true,
  rateLimit: { maxRequests: 200, windowMs: 15 * 60 * 1000 } // Generous for public
};