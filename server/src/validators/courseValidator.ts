import z from "zod";


export const createCourseSchema = z.object({
    title: z.string()
    .min(3, {message: 'Title must be at least 3 characters long'})
    .max(200, {message: 'Title too long'}),
    description: z.string()
    .min(10, {message: 'Description must be at least 10 characters long'})
    .max(2000,{message: 'Description too long'}),
    universityId: z.number()
    .int({message: 'University ID must be an integer'})
    .positive({message:'University ID must be positive'}),
    degree: z.string()
    .min(2,{message:'Degree must be atleast 2 characters long'})
    .max(100,{message:'Degree name too long'}),
    duration:z.number()
    .int({message: 'Duration must be an integer'})
    .positive({message:'Duration must be positive'})
    .max(120,{message:'Duration cannot exceed 120 months'}),
    fees: z.number()
    .int({ message: 'Fees must be an integer' })
    .nonnegative({ message: 'Fees cannot be negative' }),
  country: z.string()
    .min(2, { message: 'Country must be at least 2 characters long' })
    .max(100, { message: 'Country name too long' }),
    eligibility: z.record(z.string(), z.any()).optional()
    
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>;