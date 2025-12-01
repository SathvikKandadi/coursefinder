import { NextFunction, Request, Response } from "express";
import { activeConnections, httpRequestCounter, httpsRequestDuration } from "../services/metricsService";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    // Increment active connections
    activeConnections.inc();

    // Start timer for request duration
    const start = Date.now();

    // When response finishes
    res.on('finish', () => {
        // Decrement active connections
        activeConnections.dec();

        // Calculate duration in seconds
        const duration = (Date.now() - start) / 1000;

        // Get route pattern 
        const route = req.route ? req.route.path : req.path;

        // Record metrics
        httpRequestCounter.inc({
            method: req.method,
            route: route,
            status_code: res.statusCode
        });

        httpsRequestDuration.observe({
            method: req.method,
            route: route,
            status_code: res.statusCode
        },
        duration
    )
    })

    next();
}