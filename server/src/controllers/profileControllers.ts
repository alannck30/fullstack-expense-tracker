import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { AppError } from "../middleware/errorMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const userObject = user.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    sendSuccess(res, userWithoutPassword, "Profile retrieved successfully");
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const userId = req.userId;

    if (!name && !email && !password) {
      throw new AppError(
        "Please provide name, email or password to update",
        400,
      );
    }

    if (name && name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters long", 400);
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400);
      }
    }

    if (password) {
      if (password.length < 8) {
        throw new AppError("Password must be at least 8 characters", 400);
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

      if (!passwordRegex.test(password)) {
        throw new AppError(
          "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)",
          400,
        );
      }
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (email && email !== user.email) {
      const emailExist = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });

      if (emailExist) {
        throw new AppError("Email already in use", 409);
      }
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    const userObject = updatedUser.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    sendSuccess(res, userWithoutPassword, "Profile updated successfully");
  },
);
