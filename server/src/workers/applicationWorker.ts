import { Job, Worker } from "bullmq";
import { updateApplicationItemStatusService, updateApplicationStatusService } from "../services/applicationService";
import { ApplicationItemStatus, ApplicationStatus } from "@prisma/client";
import { prisma } from "../prisma/client";
import { submitToUniversityAPI } from "../services/externalApiService";
import { redis } from "../config/queue";
import { bullmqJobCounter } from "../services/metricsService";
import { trackQuery } from "../utils/dbMetrics";

interface ApplicationJobData {
    applicationId: number;
    userId: number;
    courseIds: number[];
}

console.log('🚀 applicationWorker.ts module is loading...');

export const applicationWorker = new Worker<ApplicationJobData>('application-submissions', async(job: Job<ApplicationJobData>) => {

    const {applicationId, courseIds} = job.data;
    console.log(`Processing application ${applicationId} with ${courseIds.length} courses`);

    bullmqJobCounter.inc({queue:'application-submissions', status: 'active'})

    // Update application status to PROCESSING
    await updateApplicationStatusService(
        applicationId,
        ApplicationStatus.PROCESSING,
        'Started processing application'
    );

    // Get application items
    const items = await trackQuery('findMany', 'applicationItem', () => prisma.applicationItem.findMany({
        where: {applicationId},
        include: {
            course: {
                include: {
                    university: true,
                }
            }
        }
    }))

    const results = {
        total: items.length,
        submitted: 0,
        accepted: 0,
        rejected: 0,
        failed: 0
    }

    for(let i = 0; i < items.length; i++) {
        const item = items[i];

        await job.updateProgress({
            current: i + 1,
            total: items.length,
            currentCourse: item.course.title
        });

        try {
            
            await updateApplicationItemStatusService(
                item.id,
                ApplicationItemStatus.PROCESSING
            );

            const result = await submitToUniversityAPI(
                item.courseId,
                item.course.universityId,
                job.data.userId
            )

            results.submitted++;

            if(result.status === 'accepted')
            {
                await updateApplicationItemStatusService(
                    item.id,
                    ApplicationItemStatus.ACCEPTED,
                    result.externalId
                );
                results.accepted++;
            }
         else if (result.status === 'rejected') {
            await updateApplicationItemStatusService(
              item.id,
              ApplicationItemStatus.REJECTED,
              result.externalId,
              result.message
            );
            results.rejected++;
          } else {
            // Pending status - mark as submitted for now
            await updateApplicationItemStatusService(
              item.id,
              ApplicationItemStatus.SUBMITTED,
              result.externalId
            );
          }
        } catch (error:any) {
            console.error(`Failed to submit item ${item.id}:`, error);
            await updateApplicationItemStatusService(
                item.id,
                ApplicationItemStatus.FAILED,
                undefined,
                error.message
            )
            results.failed++;
        }
    }

    // Determine final application status
    let finalStatus: ApplicationStatus;
    let finalMessage: string;

    if (results.failed === results.total) {
      finalStatus = ApplicationStatus.FAILED;
      finalMessage = 'All submissions failed';
    } else if (results.submitted === results.total && results.failed === 0) {
      finalStatus = ApplicationStatus.COMPLETED;
      finalMessage = `Application completed: ${results.accepted} accepted, ${results.rejected} rejected`;
    } else {
      finalStatus = ApplicationStatus.PARTIALLY_COMPLETED;
      finalMessage = `Partially completed: ${results.submitted} submitted, ${results.failed} failed`;
    }

    // Update final application status
    await updateApplicationStatusService(
        applicationId,
        finalStatus,
        finalMessage
    );

    console.log(`Application ${applicationId} completed:`, results);

    return {
        applicationId,
        results,
        finalStatus
      };
},
{
    connection: redis,
    concurrency: 5, // Process up to 5 applications concurrently
    limiter: {
      max: 10, // Max 10 jobs
      duration: 1000, // per second
    },
});

console.log('✅ BullMQ Worker instance created and listening!');

// Worker event listeners
applicationWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

applicationWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
    
    // Update application status to FAILED if job fails
    if (job?.data?.applicationId) {
      updateApplicationStatusService(
        job.data.applicationId,
        ApplicationStatus.FAILED,
        `Job failed: ${err.message}`
      ).catch(console.error);
    }
  });
  
  applicationWorker.on('active', (job) => {
    console.log(`Job ${job.id} is now active`);
  });
  
  // Graceful shutdown
  export const closeWorker = async () => {
    await applicationWorker.close();
  };