import jwt from "jsonwebtoken";
export const generateToken = (userId: string): string => {
    const secretKey = process.env.JWT_SECRET || 'your-default-secret-key';
    const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    return token;
}