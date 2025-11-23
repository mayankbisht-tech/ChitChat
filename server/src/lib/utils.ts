import jwt from "jsonwebtoken";
export const generateToken = (userId: string): string => {
    const secretKey = process.env.JWT_SECRET || 'your-default-secret-key';
    const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: '1h' });
    return token;
}