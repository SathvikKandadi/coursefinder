import { dbQueryCounter, dbQueryDuration, dbQueryErrors } from "../services/metricsService";

export async function trackQuery<T>(
    operation: string,
    model: string,
    queryFn: () => Promise<T>
): Promise<T> {
    
    const startTime = Date.now();

    try {
        
        const result = await queryFn();

        const durationInSeconds = (Date.now() - startTime) / 1000;

        dbQueryDuration.observe({
            operation,
            model
        },
        durationInSeconds
    );

    dbQueryCounter.inc({operation,model});

    return result;

    } catch (error:any) {
        
        const durationInSeconds = (Date.now() - startTime) / 1000;

        dbQueryDuration.observe({
            operation,
            model
        },
        durationInSeconds
    );

    dbQueryCounter.inc({operation,model});

    dbQueryErrors.inc({
        operation,
        model,
        error_type: error.name || 'Unknown'
    })

    console.error(`DB Query Error [${model}.${operation}]:`, error.message);

    throw error;
    }
}