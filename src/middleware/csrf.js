import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Generate a cryptographically secure CSRF token
 * @returns {string} 64-character hex token
 */
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token using timing-safe comparison
 * @param {string} clientToken - Token from client request
 * @param {string} serverToken - Token from server session
 * @returns {boolean} True if tokens match
 */
export function validateCSRFToken(clientToken, serverToken) {
  // Both tokens must be present
  if (!clientToken || !serverToken) {
    return false;
  }
  
  // Both tokens must be strings
  if (typeof clientToken !== 'string' || typeof serverToken !== 'string') {
    return false;
  }
  
  // Tokens must be same length (64 chars for hex)
  if (clientToken.length !== 64 || serverToken.length !== 64) {
    return false;
  }
  
  try {
    // Convert to buffers for timing-safe comparison
    const clientBuffer = Buffer.from(clientToken, 'hex');
    const serverBuffer = Buffer.from(serverToken, 'hex');
    
    // Buffers must be same length (32 bytes)
    if (clientBuffer.length !== 32 || serverBuffer.length !== 32) {
      return false;
    }
    
    // Timing-safe comparison
    return crypto.timingSafeEqual(clientBuffer, serverBuffer);
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('CSRF token validation error:', error.message);
    }
    return false;
  }
}

/**
 * CSRF protection middleware for API routes
 * @param {Request} request - Next.js request object
 * @returns {NextResponse|null} Error response or null if valid
 */
export function csrfMiddleware(request) {
  const method = request.method;
  
  // Skip CSRF for safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null;
  }
  
  // Skip CSRF for webhook endpoints (they use signature verification)
  const url = new URL(request.url);
  if (url.pathname.includes('/webhook') || url.pathname.includes('/postback')) {
    return null;
  }

  // Get tokens from request (try multiple header formats)
  const clientToken = request.headers.get('x-csrf-token') || 
                     request.headers.get('X-CSRF-Token') ||
                     request.headers.get('csrf-token');
  const serverToken = request.cookies.get('csrf-token')?.value;
  
  // Validate tokens
  if (!validateCSRFToken(clientToken, serverToken)) {
    // Log security event
    const logData = {
      timestamp: new Date().toISOString(),
      method,
      path: url.pathname,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      hasClientToken: !!clientToken,
      hasServerToken: !!serverToken,
      clientTokenLength: clientToken?.length || 0,
      serverTokenLength: serverToken?.length || 0
    };
    
    console.warn('CSRF validation failed:', logData);
    
    return NextResponse.json(
      { 
        error: 'CSRF token validation failed',
        code: 'INVALID_CSRF_TOKEN'
      },
      { 
        status: 403,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      }
    );
  }

  return null;
}