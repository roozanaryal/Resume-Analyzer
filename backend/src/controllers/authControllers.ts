import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";



export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { fullname, email, password, role } = req.body;
  const emailExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name: fullname,
      email,
      password: hashedPassword,
      role: role || "CANDIDATE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id, res);

  res.status(201).json({ user, token });
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user.id, res);

  // 🔐 remove password before sending
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({ user: userWithoutPassword, token });
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
