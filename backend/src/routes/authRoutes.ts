import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe, updateProfile, uploadResumeToProfile } from "../controllers/authControllers.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { uploadResume } from "../middlewares/upload.js";
import { body } from "express-validator";

const router: Router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 character"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  loginUser,
);

router.get("/me", protectRoute, getMe);
router.put("/profile", protectRoute, updateProfile);
router.put("/profile/resume", protectRoute, uploadResume.single("resume"), uploadResumeToProfile);
router.get("/logout", logoutUser);

export default router;