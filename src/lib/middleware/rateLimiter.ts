import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  onLimitReached?: (req: NextRequest, key: string) => void; // Callback when limit is reached
}

interface RateLimitInfo {
  count: number;
  resetTime: Date;
  remaining: number;
  total: number;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private store: Map<string, { count: number; resetTime: Date }> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: 60 * 1000, // 1 minute default
      maxRequests: 100, // 100 requests per minute default
      ...config,
    };
  }

  async check(req: NextRequest): Promise<{
    allowed: boolean;
    limitInfo: RateLimitInfo;
    response?: NextResponse;
  }> {
    const key = this.config.keyGenerator 
      ? this.config.keyGenerator(req)
      : this.getDefaultKey(req);

    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.windowMs);

    // Clean up expired entries
    this.cleanupExpiredEntries(windowStart);

    let record = this.store.get(key);
    
    if (!record || record.resetTime < windowStart) {
      // Create new record
      record = {
        count: 0,
        resetTime: new Date(now.getTime() + this.config.windowMs),
      };
      this.store.set(key, record);
    }

    const limitInfo: RateLimitInfo = {
      count: record.count,
      resetTime: record.resetTime,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      total: this.config.maxRequests,
    };

    if (record.count >= this.config.maxRequests) {
      // Rate limit exceeded
      if (this.config.onLimitReached) {
        this.config.onLimitReached(req, key);
      }

      const response = NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          limitInfo,
        },
        { status: 429 }
      );

      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', record.resetTime.getTime().toString());
      response.headers.set('Retry-After', Math.ceil((record.resetTime.getTime() - now.getTime()) / 1000).toString());

      return {
        allowed: false,
        limitInfo,
        response,
      };
    }

    // Increment counter
    record.count++;
    this.store.set(key, record);

    return {
      allowed: true,
      limitInfo: {
        ...limitInfo,
        remaining: this.config.maxRequests - record.count,
      },
    };
  }

  private getDefaultKey(req: NextRequest): string {
    // Use IP address as default key
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
    return `rate_limit:${ip}`;
  }

  private cleanupExpiredEntries(windowStart: Date): void {
    for (const [key, record] of this.store.entries()) {
      if (record.resetTime < windowStart) {
        this.store.delete(key);
      }
    }
  }

  // Middleware function
  middleware() {
    return async (req: NextRequest, next: () => Promise<NextResponse>) => {
      const result = await this.check(req);
      
      if (!result.allowed) {
        return result.response!;
      }

      const response = await next();
      
      // Add rate limit headers to successful responses
      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', result.limitInfo.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.limitInfo.resetTime.getTime().toString());

      return response;
    };
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req) => {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
    const userId = req.headers.get('user-id') || 'anonymous';
    return `api:${ip}:${userId}`;
  },
  onLimitReached: (req, key) => {
    console.log(`Rate limit exceeded for ${key}`);
  },
});

export const generationRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 generations per minute
  keyGenerator: (req) => {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
    const userId = req.headers.get('user-id') || 'anonymous';
    return `generation:${ip}:${userId}`;
  },
});

export const analysisRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50, // 50 analyses per minute
  keyGenerator: (req) => {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
    const userId = req.headers.get('user-id') || 'anonymous';
    return `analysis:${ip}:${userId}`;
  },
});

// Database-backed rate limiter for persistence
export class DatabaseRateLimiter extends RateLimiter {
  constructor(config: RateLimitConfig) {
    super(config);
  }

  async check(req: NextRequest): Promise<{
    allowed: boolean;
    limitInfo: RateLimitInfo;
    response?: NextResponse;
  }> {
    const key = this.config.keyGenerator 
      ? this.config.keyGenerator(req)
      : this.getDefaultKey(req);

    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.windowMs);

    // Try to get record from database
    let record = await db.rateLimitRecord.findUnique({
      where: { key },
    });

    if (!record || record.resetTime < windowStart) {
      // Create new record
      record = await db.rateLimitRecord.create({
        data: {
          key,
          count: 0,
          resetTime: new Date(now.getTime() + this.config.windowMs),
        },
      });
    }

    const limitInfo: RateLimitInfo = {
      count: record.count,
      resetTime: record.resetTime,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      total: this.config.maxRequests,
    };

    if (record.count >= this.config.maxRequests) {
      // Rate limit exceeded
      if (this.config.onLimitReached) {
        this.config.onLimitReached(req, key);
      }

      const response = NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          limitInfo,
        },
        { status: 429 }
      );

      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', record.resetTime.getTime().toString());
      response.headers.set('Retry-After', Math.ceil((record.resetTime.getTime() - now.getTime()) / 1000).toString());

      return {
        allowed: false,
        limitInfo,
        response,
      };
    }

    // Increment counter
    await db.rateLimitRecord.update({
      where: { key },
      data: { count: record.count + 1 },
    });

    return {
      allowed: true,
      limitInfo: {
        ...limitInfo,
        remaining: this.config.maxRequests - (record.count + 1),
      },
    };
  }
}
