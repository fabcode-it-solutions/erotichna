import { NextResponse } from 'next/server';
import { rateLimit } from '@/utils/security';

export function rateLimitMiddleware(request, options = {}) {
  const {
    maxRequests = 100,
    windowMs = 15 * 60 * 1000, // 15 minutes
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  // Get client identifier (IP + User-Agent for better uniqueness)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const identifier = `${ip}:${userAgent.slice(0, 50)}`;

  const result = rateLimit(identifier, maxRequests, windowMs);

  if (!result.allowed) {
    return NextResponse.json(
      { 
        error: 'Too many requests',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString()
        }
      }
    );
  }

  return null;
}