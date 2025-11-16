import z from "zod";

export const createApplicationSchema = z.object({
    courseIds: z
    .array(z.number().int().positive())
    .min(1, 'Atleast one course is required')
    .max(10, 'Maximum 10 courses per application')
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;