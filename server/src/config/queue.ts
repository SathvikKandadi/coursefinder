import Redis  from 'ioredis';
import { Queue, QueueEvents} from 'bullmq';
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: null, // For Bull Mq
});


// Create appliation submission queue
export const applicationQueue = new Queue('application-submissions' , {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 24 * 3600, // keep completed jobs for 24 hours
            count: 1000,
        },
        removeOnFail: {
            age: 7 * 24 * 3600  // keep failed jobs for 7 days
        },
    },
});

// Queue events for monitoring
export const queueEvents = new QueueEvents('application-submissions', {
    connection: redis,
})

export const closeQueue = async () => {
    await applicationQueue.close();
    await queueEvents.close();
    await redis.quit();
}

export { redis };