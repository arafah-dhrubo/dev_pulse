import { Request, Response, NextFunction } from 'express';

/**
 * Extend Express Response to include typed helper methods.
 */
declare global {
  namespace Express {
    interface Response {
      /**
       * Send a successful JSON response.
       * @param data - Payload of type T (default unknown)
       * @param message - Optional message string
       * @param status - HTTP status code (default 200)
       */
      success<T = unknown>(data: T, message?: string, status?: number): void;
      /**
       * Send an error JSON response.
       * @param message - Error message
       * @param status - HTTP status code (default 500)
       * @param data - Optional payload of type unknown
       */
      error(message: string, status?: number, data?: unknown): void;
    }
  }
}

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  // Implement the typed helpers
  res.success = <T = unknown>(data: T, message = 'Success', status = 200) => {
    res.status(status).json({ success: true, message, data });
  };

  res.error = (message: string, status = 500, data: unknown = null) => {
    res.status(status).json({ success: false, message, data });
  };

  next();
};
