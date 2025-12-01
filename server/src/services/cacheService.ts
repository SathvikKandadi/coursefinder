import Redis from "ioredis";
import { redisOperations } from "./metricsService";


interface CourseFilters {
    q?: string;
    country?: string;
    degree?: string;
    feesMin?: number;
    feesMax?: number;
    duration?: number;
    page?: number;
    limit?: number;
    sort?: string;
}

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});



class CacheService {
    private redis: Redis;
    private static instance: CacheService;
    private threshold: number;
    private timeWindow: number;

    constructor(threshold = 3, timeWindow = 3600) {
        this.redis = redis;
        this.threshold = threshold;
        this.timeWindow = timeWindow;
    }

    static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    generateQueryKey(filters: CourseFilters): string {
        const { q, country, degree, feesMin, feesMax, duration, sort } = filters;
        return `query:${q}:${country}:${degree}:${feesMin}:${feesMax}:${duration}:${sort}`;
    }

    async cacheCourseIds(queryKey: string, ids: number[], ttl: number = 3600): Promise<void> {
        await this.redis.setex(`ids:${queryKey}`, ttl, JSON.stringify(ids));
        redisOperations.inc({ operation: 'setex' });
    }

    async getCachedCourseIds(key: string): Promise<number[] | null> {
        const cached = await this.redis.get(`ids:${key}`);
        redisOperations.inc({ operation: 'get' });
        return cached ? JSON.parse(cached) : null;
    }

    async trackQueryFrequency(queryKey: string): Promise<boolean> {
        const freqKey = `freq:${queryKey}`;
        const count = await this.redis.incr(freqKey);
        redisOperations.inc({ operation: 'incr' });

        if (count === 1) {
            await this.redis.expire(freqKey, this.timeWindow);
            redisOperations.inc({ operation: 'expire' });
        }

        return count >= this.threshold;
    }

    async cacheQueryResults(queryKey: string, results: any, ttl: number = 3600): Promise<void> {
        await this.redis.setex(`results:${queryKey}`, ttl, JSON.stringify(results));
        redisOperations.inc({ operation: 'setex' });
    }

    async getCachedResults(queryKey: string): Promise<any | null> {
        const cached = await this.redis.get(`results:${queryKey}`);
        redisOperations.inc({ operation: 'get' });
        return cached ? JSON.parse(cached) : null;
    }

    invalidateCache(pattern: string) {
        console.log(`Invalidating cache for pattern: ${pattern}`);
        redisOperations.inc({ operation: 'invalidate' });
    }
  


}

export const cacheService = new CacheService();