import crypto from 'crypto';
import validator from 'validator';

// Sanitize user input for logging to prevent log injection
export function sanitizeForLog(input) {
  if (typeof input !== 'string') {
    input = String(input);
  }
  return encodeURIComponent(input).replace(/[^\w\s\-_.~]/g, '');
}

// Timing-safe string comparison
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');
  
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(bufferA, bufferB);
}

// Rate limiting store (in-memory for single instance, use Redis for production)
const rateLimitStore = new Map();

export function rateLimit(identifier, maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
  
  const current = rateLimitStore.get(identifier) || { count: 0, resetTime: now + windowMs };
  
  if (current.resetTime < now) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }
  
  current.count++;
  rateLimitStore.set(identifier, current);
  
  return {
    allowed: current.count <= maxRequests,
    remaining: Math.max(0, maxRequests - current.count),
    resetTime: current.resetTime
  };
}

// Input validation helpers
export function validateEmail(email) {
  return validator.isEmail(email);
}

export function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<\s*\/?\s*(applet|embed|object|form|frameset|ilayer|layer|bgsound|base)[^>]*>/gi, '');
}