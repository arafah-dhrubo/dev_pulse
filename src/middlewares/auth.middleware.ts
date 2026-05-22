import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Augment the Express Request object to include our decoded user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        name: string;
      };
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided, authorization denied" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT secret is not configured");
    }

    const decoded = jwt.verify(token, secret) as { id: number; role: string; name: string };

    // Attach the user to the request object so subsequent controllers can use it
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
