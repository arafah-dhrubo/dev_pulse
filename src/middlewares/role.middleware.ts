import { Request, Response, NextFunction } from "express";

export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: `Access denied. Required role: ${roles.join(' or ')}` });
            return;
        }
        next();
    };
};
