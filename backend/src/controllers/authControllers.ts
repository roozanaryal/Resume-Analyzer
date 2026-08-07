import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import fs from "fs";
import path from "path";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.body);
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const getMe = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return res.status(200).json({ user: req.user });
};

export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { name, companyName, bio, companyWebsite, companySize, companyIndustry, skills, experience, education, preferredJobType, preferredIndustry } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(companyName !== undefined && { companyName }),
        ...(bio !== undefined && { bio }),
        ...(companyWebsite !== undefined && { companyWebsite }),
        ...(companySize !== undefined && { companySize }),
        ...(companyIndustry !== undefined && { companyIndustry }),
        ...(skills !== undefined && { skills }),
        ...(experience !== undefined && { experience }),
        ...(education !== undefined && { education }),
        ...(preferredJobType !== undefined && { preferredJobType }),
        ...(preferredIndustry !== undefined && { preferredIndustry }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        resumeURL: true,
        skills: true,
        experience: true,
        education: true,
        preferredJobType: true,
        preferredIndustry: true,
        companyName: true,
        companyWebsite: true,
        companySize: true,
        companyIndustry: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If skills, bio, or experience are updated, sync profile skills into ParsedResume if present
    if (skills !== undefined || bio !== undefined || experience !== undefined) {
      try {
        const { extractSkillsFromProfile, extractSkills } = await import("../services/resumeParserService.js");
        const existingParsed = await prisma.parsedResume.findUnique({
          where: { userId: req.user.id },
        });

        if (existingParsed) {
          let resumeSkills: string[] = [];
          if (existingParsed.rawText) {
            resumeSkills = extractSkills(existingParsed.rawText);
          } else {
            try {
              resumeSkills = JSON.parse(existingParsed.skills || "[]");
            } catch {
              resumeSkills = [];
            }
          }

          const profileSkills = extractSkillsFromProfile(updatedUser);
          const combinedSkills = Array.from(new Set([...resumeSkills, ...profileSkills]));

          await prisma.parsedResume.update({
            where: { userId: req.user.id },
            data: {
              skills: JSON.stringify(combinedSkills),
            },
          });
        }
      } catch (syncErr) {
        console.error("Error syncing profile skills into ParsedResume:", syncErr);
      }
    }

    return res.status(200).json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

export const uploadResumeToProfile = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a resume file" });
  }

  const resumeURL = `/uploads/resumes/${req.file.filename}`;

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { resumeURL: true },
    });

    if (currentUser?.resumeURL) {
      const oldFilePath = path.join(process.cwd(), currentUser.resumeURL);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error("Failed to delete old resume file:", err);
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { resumeURL },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        resumeURL: true,
        skills: true,
        experience: true,
        education: true,
        preferredJobType: true,
        preferredIndustry: true,
        companyName: true,
        companyWebsite: true,
        companySize: true,
        companyIndustry: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse uploaded resume PDF and store in ParsedResume DB model asynchronously
    try {
      const { parseAndSaveUserResume } = await import("../services/resumeParserService.js");
      await parseAndSaveUserResume(req.user.id, req.file.path);
    } catch (parseErr) {
      console.error("Resume parsing error during profile upload:", parseErr);
    }

    return res.status(200).json({
      message: "Resume uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({ message: "Failed to upload resume" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
