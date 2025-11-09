import { Request, Response } from "express";
import { CreateUniversityInput, createUniversitySchema } from "../validators/universityValidator";
import { createUniversityService } from "../services/universityService";


export const createUniversity = async (req: Request, res: Response) => {
    try {
        
        const validateResult = createUniversitySchema.safeParse(req.body);

        if(!validateResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validateResult.error
            })
        }

        const universityDate: CreateUniversityInput = validateResult.data;

        const result =  await createUniversityService(universityDate);

        if(!result.success) {
            if(result.error?.includes('already exists')) {
                return res.status(409).json({message: result.error});
            }
            return res.status(500).json({message: result.error});
        }

        return res.status(201).json({
            message: 'University created successfully',
            data: result.data
        });
    } catch (error:any) {
        return res.status(500).json({ 
            message: error.message || 'Failed to create university' 
          });
    }
}