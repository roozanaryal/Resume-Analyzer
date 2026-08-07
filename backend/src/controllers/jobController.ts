import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../config/db.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { parseAndSaveUserResume, extractSkills, extractExperienceYears, extractSkillsFromProfile } from "../services/resumeParserService.js";
import { rankCandidates, type CandidateProfileForRanking } from "../services/rankingService.js";
import { sendShortlistedEmail } from "../services/emailService.js";

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

    let userContext = null;
    let recommendedIndustries: string[] = [];

    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            savedJobs: {
              include: { job: { include: { employer: true } } }
            }
          }
        });

        if (user && user.role === "CANDIDATE") {
          if (user.preferredIndustry) {
            recommendedIndustries.push(user.preferredIndustry);
          }
          user.savedJobs.forEach(sj => {
            if (sj.job.employer.companyIndustry) {
              recommendedIndustries.push(sj.job.employer.companyIndustry);
            }
          });
          // deduplicate and filter empty
          recommendedIndustries = [...new Set(recommendedIndustries)].filter(Boolean);
        }
      } catch (err) {
        // ignore invalid token for public route
      }
    }

    let recommendedWhere: any = null;
    let otherWhere: any = where;
    let totalRecommended = 0;

    // Only apply recommendations if no explicit search filters are provided
    if (recommendedIndustries.length > 0 && !search && !location && !type) {
      const indConditions = recommendedIndustries.map(ind => ({
        employer: { companyIndustry: { equals: ind, mode: "insensitive" as const } }
      }));
      
      recommendedWhere = { ...where, OR: indConditions };
      otherWhere = { ...where, NOT: { OR: indConditions } };

      totalRecommended = await prisma.job.count({ where: recommendedWhere });
    }

    const totalOther = await prisma.job.count({ where: otherWhere });
    const total = totalRecommended + totalOther;

    let jobs: any[] = [];

    if (recommendedWhere && skip < totalRecommended) {
      const recJobs = await prisma.job.findMany({
        where: recommendedWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { employer: { select: { name: true, companyName: true } } },
      });
      jobs = [...recJobs];

      if (jobs.length < limit) {
        const remaining = limit - jobs.length;
        const othJobs = await prisma.job.findMany({
          where: otherWhere,
          skip: 0,
          take: remaining,
          orderBy: { createdAt: "desc" },
          include: { employer: { select: { name: true, companyName: true } } },
        });
        jobs = [...jobs, ...othJobs];
      }
    } else {
      const actualSkip = recommendedWhere ? skip - totalRecommended : skip;
      jobs = await prisma.job.findMany({
        where: otherWhere,
        skip: actualSkip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { employer: { select: { name: true, companyName: true } } },
      });
    }

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
    // Role-based access control: Only HR and ADMIN can post jobs
    const userRole = req.user?.role;
    if (userRole !== "HR" && userRole !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Access denied. Only HR or Admin can post jobs." });
    }

    const { title, description, location, salaryRange, type, skillsRequired, experienceRequired } = req.body;
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
        skillsRequired,
        experienceRequired,
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
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            companyWebsite: true,
            companySize: true,
            companyIndustry: true,
            bio: true,
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
    const jobId = req.params.jobId as string;

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
          userId: userId as string,
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
    const jobId = req.params.id as string; // Corrected to expect jobId from param if the route is /saved/:id

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const deleted = await prisma.savedJob.deleteMany({
      where: {
        userId: userId as string,
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

/**
 * @desc    Get jobs posted by the logged-in HR
 * @route   GET /api/jobs/my-jobs
 * @access  Private (HR Only)
 */
export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (userRole !== "HR" && userRole !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. For HR/Admin only." });
    }

    const jobs = await prisma.job.findMany({
      where: { employerId: userId as string },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return res.status(200).json({ success: true, jobs });
  } catch (error: any) {
    console.error("Error in getMyJobs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Update a job post
 * @route   PUT /api/jobs/:id
 * @access  Private (HR Only/Admin)
 */
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const { title, description, location, salaryRange, type, skillsRequired, experienceRequired } = req.body;

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId !== userId && req.user?.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await prisma.job.update({
      where: { id },

      data: {
        title,
        description,
        location,
        salaryRange,
        type,
        skillsRequired,
        experienceRequired,
      },
    });

    return res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error: any) {
    console.error("Error in updateJob:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Delete a job post
 * @route   DELETE /api/jobs/:id
 * @access  Private (HR Only/Admin)
 */
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId !== userId && req.user?.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await prisma.job.delete({ where: { id } });

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleteJob:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Apply to a job post
 * @route   POST /api/jobs/apply/:jobId
 * @access  Private (Candidate)
 */
export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.jobId as string;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this position." });
    }

    let resumeURL: string | null = null;

    if (req.file) {
      resumeURL = `/uploads/resumes/${req.file.filename}`;

      // Delete old profile resume if it exists
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
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

      // Save resumeURL to candidate user profile as well
      await prisma.user.update({
        where: { id: userId },
        data: { resumeURL },
      });

      // Parse uploaded PDF resume and save to ParsedResume DB table
      try {
        await parseAndSaveUserResume(userId, req.file.path);
      } catch (parseErr) {
        console.error("Failed to parse resume on job application:", parseErr);
      }
    } else {
      // Fallback to user's saved resume URL if available
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { resumeURL: true, parsedResume: true },
      });
      resumeURL = user?.resumeURL || null;

      // If user has a resumeURL but no parsed resume yet, attempt parsing
      if (resumeURL && !user?.parsedResume) {
        const fullFilePath = path.join(process.cwd(), resumeURL);
        if (fs.existsSync(fullFilePath)) {
          try {
            await parseAndSaveUserResume(userId, fullFilePath);
          } catch (parseErr) {
            console.error("Failed to parse existing user resume file:", parseErr);
          }
        }
      }
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        resumeURL,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error: any) {
    console.error("Error in applyToJob:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * @desc    Get application status for a job
 * @route   GET /api/jobs/apply/status/:jobId
 * @access  Private (Candidate)
 */
export const getJobApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.jobId as string;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const application = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return res.status(200).json({
      hasApplied: !!application,
      application,
    });
  } catch (error: any) {
    console.error("Error in getJobApplicationStatus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get dashboard metrics and statistics for HR
 * @route   GET /api/jobs/dashboard-stats
 * @access  Private (HR Only)
 */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Run all database metric queries concurrently via Promise.all
    const [
      totalJobsPosted,
      totalApplications,
      pendingReviews,
      acceptedCount,
      recentApplications,
      jobsWithApps
    ] = await Promise.all([
      prisma.job.count({ where: { employerId: userId } }),
      prisma.application.count({ where: { job: { employerId: userId } } }),
      prisma.application.count({ where: { job: { employerId: userId }, status: "PENDING" } }),
      prisma.application.count({ where: { job: { employerId: userId }, status: "ACCEPTED" } }),
      prisma.application.findMany({
        where: { job: { employerId: userId } },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          job: { select: { title: true } },
        },
      }),
      prisma.job.findMany({
        where: { employerId: userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { applications: true } },
        },
      }),
    ]);

    return res.status(200).json({
      totalJobsPosted,
      totalApplications,
      pendingReviews,
      acceptedCount,
      recentApplications,
      topJobs: jobsWithApps.map((j) => ({
        id: j.id,
        title: j.title,
        applications: j._count.applications,
        views: (j._count.applications + 1) * 7,
        type: j.type,
        createdAt: j.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get all applicants for a specific job (HR only)
 * @route   GET /api/jobs/:id/applicants
 * @access  Private (HR Only)
 */
export const getJobApplicants = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        employerId: true,
        title: true,
        description: true,
        skillsRequired: true,
        experienceRequired: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to view applicants for this job" });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            skills: true,
            experience: true,
            education: true,
            resumeURL: true,
            parsedResume: true,
          },
        },
      },
    });

    // Build candidate profiles for ranking algorithm efficiently
    const candidateProfiles: CandidateProfileForRanking[] = applications.map((app) => {
      let parsedResume = app.user.parsedResume;

      // Trigger background non-blocking parsing if resume exists but unparsed
      const effectiveResumeURL = app.resumeURL || app.user.resumeURL;
      if (!parsedResume && effectiveResumeURL) {
        const filePath = path.join(process.cwd(), effectiveResumeURL);
        if (fs.existsSync(filePath)) {
          parseAndSaveUserResume(app.userId, filePath).catch((err) =>
            console.error("Background parsing error:", err)
          );
        }
      }

        let skills: string[] = [];
        let experienceYears = 0;
        let education: string[] = [];
        let certifications: string[] = [];
        let email = app.user.email;

        if (parsedResume) {
          email = parsedResume.email || app.user.email;
          try {
            skills = JSON.parse(parsedResume.skills || "[]");
          } catch {
            skills = [];
          }
          experienceYears = parsedResume.experienceYears || 0;
          try {
            education = JSON.parse(parsedResume.education || "[]");
          } catch {
            education = [];
          }
          try {
            certifications = JSON.parse(parsedResume.certifications || "[]");
          } catch {
            certifications = [];
          }
        }

        // Combine skills from PDF resume with user profile skills (skills section, bio, and experience)
        const profileSkills = extractSkillsFromProfile(app.user);
        if (experienceYears === 0) {
          if (app.user.bio) experienceYears = extractExperienceYears(app.user.bio);
          if (experienceYears === 0 && app.user.experience) experienceYears = extractExperienceYears(app.user.experience);
        }

        const aggregatedSkills = Array.from(new Set([...skills, ...profileSkills]));

        return {
          id: app.id,
          userId: app.userId,
          name: app.user.name,
          email,
          bio: app.user.bio,
          skills: aggregatedSkills,
          experienceYears,
          education,
          certifications,
          resumeURL: effectiveResumeURL,
          status: app.status,
          createdAt: app.createdAt,
        };
      });

    // Apply Weighted Ranking Algorithm (70% Cosine Similarity + 30% Experience Score)
    const rankedCandidates = rankCandidates(job, candidateProfiles);

    return res.status(200).json({
      jobTitle: job.title,
      applications: rankedCandidates,
    });
  } catch (error: any) {
    console.error("Error in getJobApplicants:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Update application status (HR only)
 * @route   PUT /api/jobs/application/:applicationId/status
 * @access  Private (HR Only)
 */
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const applicationId = req.params.applicationId as string;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: { employer: true }
        },
        user: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.employerId !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    if (status === "SHORTLISTED") {
      await sendShortlistedEmail(
        application.user.email,
        application.user.name,
        application.job.title,
        application.job.employer.companyName || application.job.employer.name
      );
    }

    return res.status(200).json({
      message: "Application status updated successfully",
      application: updated,
    });
  } catch (error: any) {
    console.error("Error in updateApplicationStatus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

