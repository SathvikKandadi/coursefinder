import jwt  from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // replace with real secret in .env

export interface JwtPayload {
  userId: number;
  role: string;
}


export const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token,JWT_SECRET) as JwtPayload;
}