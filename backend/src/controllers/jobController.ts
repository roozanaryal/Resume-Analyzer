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
 * @desc    Get all jobs with pagination and filtering
 * @route   GET /api/jobs
 * @access  Public
 */
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9; // Defaulting to 9 as mentioned by user
    const skip = (page - 1) * limit;

    const { search, location, type, minSalary, maxSalary } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location as string, mode: "insensitive" };
    }

    if (type) {
      where.type = type as string;
    }

    // Basic salary range filtering (assuming salaryRange is stored as a string but we can filter if numeric)
    // For now, simple match or let frontend handle complex filter if salaryRange is a string
    // If salaryRange was numeric we could do:
    // if (minSalary || maxSalary) {
    //   where.salaryRange = {
    //     gte: minSalary ? parseInt(minSalary as string) : undefined,
    //     lte: maxSalary ? parseInt(maxSalary as string) : undefined
    //   };
    // }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          employer: {
            select: {
              name: true,
              companyName: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error in getJobs:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

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

/**
 * @desc    Save a job for the candidate
 * @route   POST /api/jobs/save/:jobId
 * @access  Private (Candidate)
 */
export const saveJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already saved
    const alreadySaved = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (alreadySaved) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
    });

    return res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error: any) {
    console.error("Error in saveJobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get all saved jobs for the user
 * @route   GET /api/jobs/saved
 * @access  Private (Candidate)
 */
export const getSavedJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    const [savedJobs, total] = await Promise.all([
      prisma.savedJob.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          job: {
            include: {
              employer: {
                select: {
                  name: true,
                  companyName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.savedJob.count({ where: { userId } }),
    ]);

    return res.status(200).json({
      success: true,
      savedJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error in getSavedJobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Delete a saved job
 * @route   DELETE /api/jobs/saved/:id
 * @access  Private (Candidate)
 */
export const deleteSavedJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.id; // Corrected to expect jobId from param if the route is /saved/:id

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const deleted = await prisma.savedJob.deleteMany({
      where: {
        userId,
        jobId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    return res.status(200).json({ message: "Saved job removed successfully" });
  } catch (error: any) {
    console.error("Error in deleteSavedJob:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

