export interface SubmissionResult {
    success: boolean;
    externalId?: string;
    status: 'accepted' | 'rejected' | 'pending';
    message?: string;
}

export const submitToUniversityAPI = async (
    courseId: number,
    universityId: number,
    userId: number
): Promise<SubmissionResult> => {

    const delay = Math.random() * 4000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const random = Math.random();

    if(random < 0.1) {
        // 10% chance of API failure
        throw new Error('University API templorarily unavailable');
    }
    else if (random < 0.7) {
        // 60% chance of acceptance
        return {
            success: true,
            externalId: `EXT-${universityId}-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
            status: 'accepted',
            message: 'Application submitted successfully'
        };
    } else if (random < 0.9) {
        //20% chance of rejection
        return {
            success: true,
            externalId: `EXT-${universityId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: 'rejected',
      message: 'Does not meet eligibility criteria'
        };
    }
    else {
        // 10% chance of pending review
        return {
          success: true,
          externalId: `EXT-${universityId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          message: 'Application under review'
        };
}}


export const checkApplicationStatus = async (externalId: string): Promise<SubmissionResult> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const random = Math.random();

    if(random < 0.6) {
        return {
            success: true,
            externalId,
            status: 'accepted',
            message: 'Application approved after review'
        }
    }
    else {
        return {
            success: true,
            externalId,
            status: 'rejected',
            message: 'Application rejected after review'
        }
    }
}