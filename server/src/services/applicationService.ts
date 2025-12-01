import { prisma } from "../prisma/client";
import { applicationQueue } from "../config/queue";
import { ApplicationStatus, ApplicationItemStatus } from "@prisma/client";
import { applicationSubmissions, dbQueryCounter, dbQueryDuration } from "./metricsService";
import { trackQuery } from "../utils/dbMetrics";


interface CreateApplicationInput {
    userId: number;
    courseIds: number[];
}

export const createApplicationService = async (data: CreateApplicationInput) => {
    try {

        const courses = await trackQuery('findMany', 'course', () => prisma.course.findMany({
            where: {
                id: { in: data.courseIds }
            },
            include: {
                university: true
            }
        })) 

        if (courses.length !== data.courseIds.length) {
            return {
                success: false,
                error: 'One or more courses not found'
            }
        }

        const application = await trackQuery('create', 'application' ,() => prisma.application.create({
            data: {
                userId: data.userId,
                status: ApplicationStatus.PENDING,
                items: {
                    create: data.courseIds.map(courseId => ({
                        courseId,
                        status: ApplicationItemStatus.PENDING,
                    }))
                },
                statusHistory: {
                    create: {
                        toStatus: ApplicationStatus.PENDING,
                        message: 'Application created'
                    }
                }
            },
            include: {
                items: {
                    include: {
                        course: {
                            include: {
                                university: true
                            }
                        }
                    }
                }
            }
        }));

        const job = await applicationQueue.add(
            'process-application',
            {
                applicationId: application.id,
                userId: data.userId,
                courseIds: data.courseIds
            },
            {
                jobId: `app-${application.id}`,
            }
        )

        await trackQuery('update', 'application', () => prisma.application.update({
            where: { id: application.id },
            data: { jobId: job.id }
        }));

        // ADD APPLICATION SUBMISSION METRIC
        applicationSubmissions.inc({ status: 'PENDING' });

        return {
            success: true,
            data: {
                ...application,
                jobId: job.id
            }
        };
    } catch (error: any) {
        console.error({ message: "Error creating application", error });
        return {
            success: false,
            errro: error.message || 'Failed to create application'
        };
    }
};

export const getApplicationByIdService = async (id: number, userId?: number) => {
    try {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }

        const application = await trackQuery('findUnique', 'application', ()=> prisma.application.findUnique({
            where,
            include: {
                items: {
                    include: {
                        course: {
                            include: {
                                university: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: true,
                                        website: true
                                    }
                                }
                            }
                        }
                    }
                },
                statusHistory: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        }));
        return application;
    } catch (error: any) {
        console.error({ message: "Error fetching application", error });
        return null;
    }
}

export const getApplicationStatusesService = async (id: number, userId?: number) => {
    try {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }


        const application = await trackQuery('findUnique', 'application', ()=> prisma.application.findUnique({
            where,
            include: {
                statusHistory: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        }));
 
        if (!application) {
            return null;
        }

        return {
            appliationId: application.id,
            currentStatus: application.status,
            statusHistory: application.statusHistory
        };
    } catch (error: any) {
        console.error({ message: "Error fetching application statuses", error });
        return null;
    }
}

export const getUserApplicationsService = async (userId: number, page: number = 1, limit: number = 10) => {

    try {

        const skip = (page - 1) * limit;
        
        const start = Date.now();

        const [applications, total] = await Promise.all([
            trackQuery('findMany', 'application', () => 
            prisma.application.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            course: {
                                include: {
                                    university: {
                                        select: {
                                            id: true,
                                            name: true,
                                            country: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    submittedAt: 'desc'
                },
                skip,
                take: limit
            })),
            trackQuery('count', 'application', () => prisma.application.count({ where: { userId } }))
        ]);

        return {
            applications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    } catch (error) {
        console.error({ message: "Error fetching user applications", error });
        return null;
    }
}

export const updateApplicationStatusService = async (applicationId: number, newStatus: ApplicationStatus, message?: string
) => {
    const application = await trackQuery('findUnique','application', ()=> prisma.application.findUnique({
        where: { id: applicationId }
    }));

    if (!application) {
        return null;
    }

    const result =  await trackQuery('update', 'application', () => prisma.application.update({
        where: { id: applicationId },
        data: {
            status: newStatus,
            statusHistory: {
                create: {
                    fromStatus: application.status,
                    toStatus: newStatus,
                    message
                }
            }
        }
    }));

    applicationSubmissions.inc({status: newStatus});

    return result;
};

export const updateApplicationItemStatusService = async (itemId: number, status: ApplicationItemStatus, externalId?: string, rejectionReason?: string) => {


    const result =  await trackQuery('update', 'application', () => prisma.applicationItem.update({
        where: { id: itemId },
        data: {
            status,
            externalId,
            rejectionReason,
            submittedAt: status === ApplicationItemStatus.SUBMITTED ? new Date() : undefined
        }
    }));
    
    return result;
};