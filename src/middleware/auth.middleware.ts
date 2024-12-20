import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access Denied' });
        return; // Ensure no further code is executed
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use an environment variable in production
        (req as any).user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
}


export function authorizeRoles(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
            return;
        }

        next();
    };
}