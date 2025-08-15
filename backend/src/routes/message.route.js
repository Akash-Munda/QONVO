import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import uploader from "../controllers/uploader.controller.js";

const router = express.Router();

router.get("/users", protectRoute(true), getUsersForSidebar);
router.get("/:id", protectRoute(true), getMessages);

router.post("/send/:id", protectRoute(true), uploader, sendMessage);

export default router;
