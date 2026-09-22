import crypto from 'crypto';

// Fix timing attack vulnerability - use for sensitive comparisons
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

// Sanitize input for logging to prevent log injection
export function sanitizeForLog(input) {
  if (typeof input !== 'string') {
    input = String(input);
  }
  // Remove control characters and encode special characters
  return encodeURIComponent(input).replace(/[^\w\s\-_.~]/g, '');
}

// Secure password comparison
export async function securePasswordCompare(plaintext, hash) {
  try {
    const bcrypt = await import('bcrypt');
    return await bcrypt.compare(plaintext, hash);
  } catch (error) {
    console.error('Password comparison failed:', sanitizeForLog(error.message));
    return false;
  }
}

// Generate secure random tokens
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Validate and sanitize user input
export function validateAndSanitize(input, type = 'string') {
  if (!input) return null;
  
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) ? input.toLowerCase().trim() : null;
      
    case 'username':
      // Allow alphanumeric, underscore, hyphen
      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      return usernameRegex.test(input) ? input.trim() : null;
      
    case 'string':
      // Basic string sanitization
      return input.toString().trim().slice(0, 1000); // Limit length
      
    case 'number':
      const num = parseFloat(input);
      return isNaN(num) ? null : num;
      
    default:
      return input.toString().trim();
  }
}

// Content Security Policy headers
export function getCSPHeaders() {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://omnisnippet1.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https://files-erotichna.b-cdn.net https://storage.bunnycdn.com",
      "connect-src 'self' https://api.omnisend.com https://secure.verotel.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  };
}