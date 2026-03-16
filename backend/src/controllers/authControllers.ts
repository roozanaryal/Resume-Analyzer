import { validationResult } from "express-validator";
import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { fullname, email, password } = req.body;
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
    data:{
      fullname,
      email,
      password:hashedPassword
    }
  })


    // const token = user.generateAuthToken();
    res.status(201).json({ user });
};

export const loginUser = async (req:any, res:any, next:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  //   const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    // return res.status(401).json({ message: "Invalid email or password" });
  }

  //   const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    // return res.status(401).json({ message: "Invalid email or password" });
  }

  //   const token = user.generateAuthToken();

  // 🔐 remove password before sending
  //   user.password = undefined;

  return res.status(200).json({ user, token });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
