import { z } from 'zod';

export const createUniversitySchema = z.object({
  name: z.string()
    .min(3, { message: 'University name must be at least 3 characters long' })
    .max(200, { message: 'University name too long' }),
  country: z.string()
    .min(2, { message: 'Country must be at least 2 characters long' })
    .max(100, { message: 'Country name too long' }),
  website: z.string()
    .url({ message: 'Invalid website URL format' })
    .optional()
    .or(z.literal('')) // Allow empty string
});

export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
