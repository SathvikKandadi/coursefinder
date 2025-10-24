import { Request, Response } from "express";
import { loginService, signupService } from "../services/authService";
import { loginSchema, signupSchema } from "../validators/authValidator";

export const signup = async (req:Request, res:Response) => {
    try {
        const parsedData = signupSchema.safeParse(req.body);

        if (!parsedData.success) {
            const errors = parsedData.error.issues.map((err) => err.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
      
        const { email, password, name } = parsedData.data;

        const result = await signupService(email, password, name);

        if(!result)
            return res.status(400).json({message:'User already exists or signup failed' });

        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: result.user.id, email: result.user.email, name: result.user.name },
            token: result.token,
        });
        
    } catch (error:any) {
        return res.status(400).json({ message: error.message || 'Signup failed' });
    }
}

export const login = async (req:Request, res:Response) => {
    try{
        const parsedData = loginSchema.safeParse(req.body);

        if (!parsedData.success) {
            const errors = parsedData.error.issues.map((err) => err.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const { email, password} = parsedData.data;

        const token = await loginService(email, password);

        if(!token)
            return res.status(401).json({message:'Email or Password is incorrect' });

        return res.status(200).json({
            message: 'Login successfull',
            token
        })
        
    } catch(error:any) {
        return res.status(400).json({ message: error.message || 'Login failed' });
    }
}