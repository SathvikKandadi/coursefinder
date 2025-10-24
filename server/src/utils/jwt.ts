import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // replace with real secret in .env

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' }); // valid for 7 days
};


export const verifyToken = (token: string): string | JwtPayload => {
    return jwt.verify(token,JWT_SECRET);
}