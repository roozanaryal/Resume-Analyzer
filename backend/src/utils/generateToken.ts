import jwt from "jsonwebtoken";
import type { Response } from "express";


export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};