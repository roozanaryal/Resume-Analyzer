import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../config/db.js";

// Helper interface for authenticated requests
interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * @desc    Post a new job
 * @route   POST /api/jobs/post
 * @access  Private (HR Only)
 */
export const postJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is HR
    const userRole = req.user?.role;
    if (userRole !== "HR") {
      return res.status(403).json({ message: "Access denied. Only HR can post jobs." });
    }

    const { title, description, location, salaryRange, type } = req.body;
    const employerId = req.user?.id;

    if (!employerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salaryRange,
        type,
        employerId,
      },
    });

    return res.status(201).json({
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error: any) {
    console.error("Error in postJob:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error: any) {
    console.error("Error in getJob:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const saveJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Logic for saving jobs (to be implemented)
  return res.status(501).json({ message: "Not implemented" });
};

export const getSavedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Logic for getting saved jobs (to be implemented)
  return res.status(501).json({ message: "Not implemented" });
};

export const deleteSavedJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Logic for deleting saved jobs (to be implemented)
  return res.status(501).json({ message: "Not implemented" });
};
