import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const successResponse = <T>(res: Response, data: T, message = 'Success', statusCode = 200): void => {
  res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = <T = unknown>(res: Response, message: string, statusCode = 500, data?: T): void => {
  res.status(statusCode).json({ success: false, message, data });
};
