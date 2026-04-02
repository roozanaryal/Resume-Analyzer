import { Router } from "express";
import {
  postJob,
  getJob,
  saveJobs,
  getSavedJobs,
  deleteSavedJob,
  getJobs,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { body } from "express-validator";

const router: Router = Router();

// Post a new job (HR only - should be checked in controller)
router.post(
  "/post",
  protectRoute,
  [
    body("title").notEmpty().withMessage("Job title is required").trim(),
    body("description")
      .notEmpty()
      .withMessage("Job description is required")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("location").notEmpty().withMessage("Location is required").trim(),
    body("salaryRange").optional().trim(),
    body("type").optional().trim(),
  ],
  postJob,
);

// Get all jobs with pagination and filtering
router.get("/", getJobs);

// HR specific: Get jobs posted by the logged-in user (Move before /:id)
router.get("/my-jobs", protectRoute, getMyJobs);

// Saved jobs routes (Move /saved before /:id)
router.get("/saved", protectRoute, getSavedJobs);
router.post("/save/:jobId", protectRoute, saveJobs);
router.delete("/saved/:id", protectRoute, deleteSavedJob);

// Parameterized job routes (Specific job actions)
router.get("/:id", getJob);
router.put("/:id", protectRoute, updateJob);
router.delete("/:id", protectRoute, deleteJob);

export default router;
