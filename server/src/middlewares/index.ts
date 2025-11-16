import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}


export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if(!req.user?.id || !req.user?.role){
      return res.status(401).json({message: 'Unauthorized - Authentication required'});
    }

    if(!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({
        message: 'Forbidden - Insufficient permissions',
        required: allowedRoles,
        current: req.user?.role
      })
    }
    next();
  }
}

export const adminOnly = requireRole('ADMIN');
export const studentOnly = requireRole('STUDENT');
export const studentOrAdmin = requireRole('STUDENT', 'ADMIN');