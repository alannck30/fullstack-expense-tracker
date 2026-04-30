import { AuthResponse } from "../types/index.js";
import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { AppError } from "../middleware/errorMiddleware.js";
import User from "../models/User.js";

// export let fakeUsers: User[] = [
//   {
//     _id: "user123",
//     name: "John Doe",
//     email: "john@example.com",
//     password: "password123",
//     createdAt: new Date("2026-01-01"),
//     updatedAt: new Date("2026-01-01"),
//   },
//   {
//     _id: "user456",
//     name: "Jane Smith",
//     email: "jane@example.com",
//     password: "password456",
//     createdAt: new Date("2026-01-05"),
//     updatedAt: new Date("2026-01-05"),
//   },
// ];

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Please provide name, email and password", 400);
    }

    if (!name && !email && !password) {
      throw new AppError(
        "Please provide name, email or password to update",
        400,
      );
    }

    if (name && name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters", 400);
    }

    if (name && name.trim().length > 50) {
      throw new AppError("Name cannot exceed 50 characters", 400);
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

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }
    const newUser = new User({
      name,
      email,
      password,
    });

    const savedUser = await newUser.save();

    const userObject = savedUser.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    const authResponse: AuthResponse = {
      user: { ...userWithoutPassword, _id: savedUser._id.toString() },
      token: "fake-jwt-token-" + savedUser._id,
    };

    sendSuccess(res, authResponse, "Account created successfully", 201);
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const userObject = user.toObject();

    const { password: _, ...userWithoutPassword } = userObject;

    const authResponse: AuthResponse = {
      user: { ...userWithoutPassword, _id: user._id.toString() },
      token: "fake-jwt-token-" + user._id,
    };

    sendSuccess(res, authResponse, "Login successfully");
  },
);
