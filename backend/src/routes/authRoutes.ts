import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController";
import { body } from "express-validator";

const router: express.Router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstName")
      .isLength({ min: 3 })
      .withMessage("FirstName must be min of 3 character"),
    body("password").isLength({ min: 6 }).withMessage("write a long password"),
  ],
  registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email format"),
    body("password").isLength({ min: 6 }).withMessage("write a long password"),
  ],
  loginUser,
);


router.get("/logout",logoutUser);

export default router;