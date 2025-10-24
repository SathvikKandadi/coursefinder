import { Request, Response } from "express";
import { getCourseByIdService, getCoursesByUniversityService, getCoursesService } from "../services/courseService";

export const getCourses = async (req:Request, res:Response) => {
    try {
        const {
            q,
            country,
            degree,
            feesMin,
            feesMax,
            duration,
            page,
            limit,
            sort
        } = req.query;

        const filters = {
            q: q as string,
            country: country as string,
            degree: degree as string,
            feesMin: feesMin ? parseInt(feesMin as string) : undefined,
            feesMax: feesMax ? parseInt(feesMax as string) : undefined,
            duration: duration ? parseInt(duration as string) : undefined,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
            sort: sort as string
        }

        const result = await getCoursesService(filters);

        if(!result){
            return res.status(500).json({message: 'Failed to fetch courses'});
        }

        return res.status(200).json({
            message: 'Courses fetched successfully',
            data: result.courses,
            pagination: result.pagination
        })
    } catch (error:any) {
        return res.status(500).json({message: error.message || 'Failed to fetch courses'});
    }

}


export const getCourseById = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const courseId = parseInt(id);

        if(isNaN(courseId)){
            return res.status(400).json({message: 'Invalid course ID'});
        }

        const course = await getCourseByIdService(courseId);

        if(!course) {
            return res.status(404).json({message: 'Course not found'});
        }

        return res.status(200).json({
            message:'Course fetched successfully',
            data:course
        })
    } catch (error:any) {
        return res.status(500).json({message: error.message || 'Failed to fetch course'});
    }
}

export const getCoursesByUniversity = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const universityId = parseInt(id);

        if(isNaN(universityId))
        {
            return res.status(500).json({message:'Invalid university Id'});
        }

        const {
            q,
            degree,
            feesMin,
            feesMax,
            duration,
            page,
            limit,
            sort
        } = req.query;

        const filters = {
            q: q as string,
            degree: degree as string,
            feesMin : feesMin ? parseInt(feesMin as string) : undefined,
            feesMax : feesMax ? parseInt(feesMax as string) : undefined,
            duration : duration ? parseInt(duration as string) : undefined,
            page : page ? parseInt(page as string) : 1,
            limit : limit ? parseInt(limit as string) : 10,
            sort: sort as string
        };

        const result = await getCoursesByUniversityService(universityId,filters);

        if(!result)
        {
            return res.status(500).json({message:'Failed to fetch university courses'});
        }

        return res.status(200).json({
            message: 'University courses fetched successfully',
            data: result.courses,
            pagination: result.pagination
        });

    } catch (error:any) {
        return res.status(500).json({message: error.message || 'Failed to fetch university courses'});
    }
}