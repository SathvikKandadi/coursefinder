import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from "prom-client";

export const register = new Registry();

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// Custom Metrics

// HHTP Request Counter
export const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
})

// HTTP Request Duration
export const httpsRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5], // Response time buckets in seconds
    registers: [register]
})

// Active Connections
export const activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
    registers: [register]
})

// Database Query Counter
export const dbQueryCounter = new Counter({
    name: 'database_queries_total',
    help: 'Total number of database queries',
    labelNames: ['operation', 'model'],
    registers: [register]
})

// Database Query Duration
export const dbQueryDuration = new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'model'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1],
    registers: [register]
})

export const dbQueryErrors = new Counter({
    name: 'database_query_errors_total',
    help: 'Total number of database query errors',
    labelNames: ['operation', 'model', 'error_type'],
    registers: [register]
})

// Application Specific Metrics 
export const applicationSubmissions = new Counter({
    name: 'application_submissions_total',
    help: 'Total number of course applications submitted',
    labelNames: ['status'], // PENDING, ACCEPTED, REJECTED
    registers: [register]
});


// BullMQ Job Metrics
export const bullmqJobCounter = new Counter({
    name: 'bullmq_jobs_total',
    help: 'Total number of BullMQ jobs',
    labelNames: ['queue', 'status'],
    registers: [register]
})

// Redis Operations
export const redisOperations = new Counter({
    name: 'redis_operations_total',
    help: 'Total number of Redis operations',
    labelNames: ['operation'],
    registers: [register]
})

