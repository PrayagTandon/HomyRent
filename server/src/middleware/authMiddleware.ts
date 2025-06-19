import { Request, Response ,NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    sub: string;
    "custom:role"?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            }
        }
    }
}

export const authMiddleware = (allowedRules: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const token = req.headers.authorization?.split(" ")[1];
    }
}