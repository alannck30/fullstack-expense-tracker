import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorMiddleware.js";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = "69f3798267bab4cf6ad9967c";
  if (!userId) {
    throw new AppError("User not authenticated. Please login", 401);
  }
  req.userId = userId;
  next();
};
