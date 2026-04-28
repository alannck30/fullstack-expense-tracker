import { AuthResponse, User } from "../types/index.js";
import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { AppError } from "../middleware/errorHandler.js";

export let fakeUsers: User[] = [
  {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "user456",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
];

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError("Please provide name, email and password", 400);
    }
    const existingUser = fakeUsers.find((user) => user.email === email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fakeUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const authResponse: AuthResponse = {
      user: userWithoutPassword,
      token: "fake-jwt-token-" + newUser.id,
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
    const user = fakeUsers.find((user) => user.email === email);
    if (!user || user.password !== password) {
      throw new AppError("Invalid email and password", 401);
    }
    const { password: _, ...userWithoutPassword } = user;
    const authResponse: AuthResponse = {
      user: userWithoutPassword,
      token: "fake-jwt-token-" + user.id,
    };

    sendSuccess(res, authResponse, "Login successfully", 201);
  },
);
