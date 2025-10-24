import Redis from "ioredis";


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


class QueryFrequencyTracker {
    private redis: Redis;
    private threshold: number;
    private timeWindow: number; // in seconds 
    private static instance: QueryFrequencyTracker; 

    constructor(redisClient: Redis, threshold = 3, timeWindow = 3600) {
        this.redis = redisClient;
        this.threshold = threshold;
        this.timeWindow = timeWindow;
    }

    static getInstance(redisClient: Redis): QueryFrequencyTracker {
        if (!QueryFrequencyTracker.instance) {
            if (!redisClient) {
                throw new Error('Redis client is required for first initialization');
            }
            QueryFrequencyTracker.instance = new QueryFrequencyTracker(redisClient);
        }
        return QueryFrequencyTracker.instance;
      }
    

    // If the same query has been called more than 3 times in an hour caching it.
    async shouldCache(queryKey: string): Promise<boolean> {
        try {
            const key = `query_freq:${queryKey}`;
            const count = await this.redis.incr(key);

            if(count === 1)
            {
                await this.redis.expire(key,this.timeWindow);
            }

            return count >= this.threshold;
        } catch (error) {
            console.error('Error tracking query frequency:', error);
            return false;
        }
    }

}

class CacheService {
    private redis: Redis;
    private queryTracker: QueryFrequencyTracker;
    private static instance: CacheService;
    private threshold: number;
    private timeWindow: number;

    constructor(threshold = 3, timeWindow = 3600) {
        this.redis=redis;
        this.queryTracker = QueryFrequencyTracker.getInstance(redis);
        this.threshold = threshold;
        this.timeWindow = timeWindow;
    }

    static getInstance(): CacheService {
        if(!CacheService.instance)
        {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    generateQueryKey(filters: CourseFilters): string {
        const { q, country, degree, feesMin, feesMax, duration, page, limit, sort } = filters;
        return `query:${q}:${country}:${degree}:${feesMin}:${feesMax}:${duration}:${page}:${limit}:${sort}`;
    }

    async trackQueryFrequency(queryKey: string): Promise<boolean> {
        const freqKey = `freq:${queryKey}`;
        const count = await this.redis.incr(freqKey);
        
        if (count === 1) {
            await this.redis.expire(freqKey, this.timeWindow);
        }
        
        return count >= this.threshold;
    }

    async cacheQueryResults(queryKey:string, results:any): Promise<void> {
        await this.redis.setex(`results:${queryKey}`, 3600, JSON.stringify(results));
    }

    async getCachedResults(queryKey: string): Promise<any | null> {
        const cached = await this.redis.get(`results:${queryKey}`);
        return cached ? JSON.parse(cached) : null;
    }
  
}

export const cacheService = new CacheService();