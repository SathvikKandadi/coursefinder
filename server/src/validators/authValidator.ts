import {email, z} from 'zod';

export const signupSchema = z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string()
    .min(6,{message:'Password must be at least 6 characters long'})
    .max(50,{message:'Password too long'}),
    name: z.string()
    .min(2,{message:'Name must be at least 2 characters long'})
    .max(100,{message:'Name too long'}),
});

export const loginSchema = z.object({
    email: z.email({message: 'Invalid email format'}),
    password:z.string()
    .min(6,{message:'Password must be at least 6 characters long'})
    .max(50,{message:'Password too long'}),
})

export type SignupInput = z.infer<typeof signupSchema>;

export type loginInput = z.infer<typeof loginSchema>;