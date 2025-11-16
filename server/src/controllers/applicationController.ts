import { Request, Response } from "express";
import { createApplicationSchema } from "../validators/applicationValidator"
import { createApplicationService, getApplicationByIdService, getApplicationStatusesService, getUserApplicationsService } from "../services/applicationService";
import { applicationQueue } from "../config/queue";

export const createApplication = async (req: Request, res: Response) => {
    try {
        const validateResult = createApplicationSchema.safeParse(req.body);

        if(!validateResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validateResult.error
            })
        }

        const userId = req.user?.id;

        if(!userId)
        {
            return res.status(401).json({message : 'Unauthorized'});
        }

        const result = await createApplicationService({
            userId,
            courseIds: validateResult.data.courseIds
        });

        if(!result.success) {
            return res.status(400).json({message: result.error});
        }

        return res.status(201).json({
            message: 'Application created and queued for processing',
            data:result.data
        })

    } catch (error:any) {
        console.log('Error creating application', error);
        return res.status(500).json({
            message: error.message || 'Failed to create application'
        });
    }
}

export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const applicationId = parseInt(id);

        if(isNaN(applicationId)) {
            return res.status(400).json({message: 'Invalid application ID'});
        }

        const userId = req.user?.id;
        const userRole = req.user?.role;

        const application = await getApplicationByIdService(
            applicationId,
            userRole === 'ADMIN' ? undefined : userId
        );

        if(!application) {
            return res.status(404).json({ message: 'Application not found'});
        }

        let jobStatus = null;
        if(application.jobId) {
            try {
                const job = await applicationQueue.getJob(application.jobId);
                if(job) {
                    const state = await job.getState();
                    const progress = job.progress;
                    jobStatus = {
                        state,
                        progress,
                        attemptsMade: job.attemptsMade,
                        processedOn: job.processedOn,
                        finishedOn: job.finishedOn
                    };
                }
            }
            catch(error) {
                console.error('Error fetching job status:', error);
            }
        }

        return res.status(200).json({
            message: 'Application fetched successfully',
            data: {
                ...application,
                jobStatus
            }
        });
    } catch (error:any) {
        console.error('Error fetching application:', error);
        return res.status(500).json({
            message: error.message || 'Failed to fetch application'
        });
    }
}

export const getApplicationStatuses = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const applicationId = parseInt(id);
  
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID' });
      }
  
      const userId = req.user?.id;
      const userRole = req.user?.role;
  
      const statuses = await getApplicationStatusesService(
        applicationId,
        userRole === 'ADMIN' ? undefined : userId
      );
  
      if (!statuses) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      return res.status(200).json({
        message: 'Application statuses fetched successfully',
        data: statuses
      });
    } catch (error: any) {
      console.error('Error fetching application statuses:', error);
      return res.status(500).json({
        message: error.message || 'Failed to fetch application statuses'
      });
    }
  };


  export const getUserApplications = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit? parseInt(req.query.limit as string) : 10;

        const result = await getUserApplicationsService(userId, page, limit);

        if(!result) {
            return res.status(500).json({message: 'Failed to fetch applications'});
        }

        return res.status(200).json({
            message: 'Application fetched successfully',
            data: result.applications,
            pagination: result.pagination
        });
    } catch (error:any) {
        console.error('Error fetching user applications:', error);
        return res.status(500).json({
            message: error.message || 'Failed to fetch applications'
        })
    }
  }