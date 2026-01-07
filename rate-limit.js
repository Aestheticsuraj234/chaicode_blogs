import { RateLimiterPostgres } from "rate-limiter-flexible";
import { Pool } from "pg";

// Create PostgreSQL connection pool for rate limiter
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Rate limiter for API requests (general)
export const apiRateLimiter = new RateLimiterPostgres({
    storeClient: pool,
    tableName: "rate_limit_api",
    keyPrefix: "api",
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds (1 minute)
    blockDuration: 60, // Block for 1 minute if exceeded
});

// Rate limiter for repository connections (free tier)
export const repositoryRateLimiter = new RateLimiterPostgres({
    storeClient: pool,
    tableName: "rate_limit_repository",
    keyPrefix: "repo",
    points: 5, // 5 repositories
    duration: 0, // No time limit, just total count
    blockDuration: 0,
});

// Rate limiter for reviews per repository (free tier)
export const reviewRateLimiter = new RateLimiterPostgres({
    storeClient: pool,
    tableName: "rate_limit_review",
    keyPrefix: "review",
    points: 5, // 5 reviews per repo
    duration: 0, // No time limit, just total count
    blockDuration: 0,
});

/**
 * Check if user has exceeded rate limit
 * Returns true if allowed, false if rate limited
 */
export async function checkRateLimit(
    limiter: RateLimiterPostgres,
    key: string
): Promise<{ allowed: boolean; remaining: number }> {
    try {
        const result = await limiter.consume(key, 1);
        return {
            allowed: true,
            remaining: result.remainingPoints,
        };
    } catch (error: any) {
        if (error.remainingPoints !== undefined) {
            return {
                allowed: false,
                remaining: error.remainingPoints,
            };
        }
        throw error;
    }
}

/**
 * Get remaining points for a key
 */
export async function getRemainingPoints(
    limiter: RateLimiterPostgres,
    key: string
): Promise<number> {
    try {
        const result = await limiter.get(key);
        if (!result) {
            return limiter.points;
        }
        return result.remainingPoints;
    } catch (error) {
        console.error("Error getting remaining points:", error);
        return 0;
    }
}

/**
 * Reset rate limit for a key
 */
export async function resetRateLimit(
    limiter: RateLimiterPostgres,
    key: string
): Promise<void> {
    try {
        await limiter.delete(key);
    } catch (error) {
        console.error("Error resetting rate limit:", error);
    }
}