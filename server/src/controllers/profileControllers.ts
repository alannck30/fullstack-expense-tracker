import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { fakeUsers } from "./authControllers.js";
import { AppError } from "../middleware/errorHandler.js";

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = "user123";
    const user = fakeUsers.find((user) => user.id === userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, userWithoutPassword, "Profile retrieved successfully");
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    const userId = "user123";

    if (!name && !email) {
      throw new AppError("Please provide name and email to update", 400);
    }

    const user = fakeUsers.find((user) => user.id === userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const userIndex = fakeUsers.indexOf(user);

    if (email && email !== fakeUsers[userIndex]?.email) {
      const emailExist = fakeUsers.find((user) => user.email === email);
      if (emailExist) {
        throw new AppError("Email already in use", 409);
      }
    }
    fakeUsers[userIndex] = {
      ...user,
      name: name ?? fakeUsers[userIndex]?.name,
      email: email ?? fakeUsers[userIndex]?.email,
      updatedAt: new Date(),
    };

    const { password: _, ...userWithoutPassword } = fakeUsers[userIndex];

    sendSuccess(res, userWithoutPassword, "Profile updated successfully");
  },
);
