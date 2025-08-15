import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  getUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import uploader from "../controllers/uploader.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/get/:id", getUser);

router.post("/login", protectRoute(false), login);

router.post("/logout", logout);

router.post("/update-Profile", protectRoute(true), uploader, updateProfile);
// router.put("/update-Profile", protectRoute(true), uploader, updateProfile);

router.get("/check", protectRoute(true), checkAuth);

export default router;
