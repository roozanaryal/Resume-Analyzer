import { Router } from "express";
import { postJob, getJob, saveJobs, getSavedJobs, deleteSavedJob } from "../controllers/jobController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { body } from "express-validator";

const router: Router = Router();

// Post a new job (HR only - should be checked in controller)
router.post(
  "/post",
  protectRoute,
  [
    body("title").notEmpty().withMessage("Job title is required").trim(),
    body("description").notEmpty().withMessage("Job description is required").isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),
    body("location").notEmpty().withMessage("Location is required").trim(),
    body("salaryRange").optional().trim(),
    body("type").optional().trim(),
  ],
  postJob
);

// Get a specific job
router.get("/:id", getJob);

// Saved jobs routes (Candidate mostly)
router.post("/save/:jobId", protectRoute, saveJobs);
router.get("/saved", protectRoute, getSavedJobs);
router.delete("/saved/:id", protectRoute, deleteSavedJob);

export default router;
