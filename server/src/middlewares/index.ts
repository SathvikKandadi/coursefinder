import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}


export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if(!req.userId || !req.userRole){
      return res.status(401).json({message: 'Unauthorized - Authentication required'});
    }

    if(!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: 'Forbidden - Insufficient permissions',
        required: allowedRoles,
        current: req.userRole
      })
    }
    next();
  }
}

export const adminOnly = requireRole('ADMIN');
export const studentOnly = requireRole('STUDENT');
export const studentOrAdmin = requireRole('STUDENT', 'ADMIN');