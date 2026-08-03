import { Router } from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from "../controllers/messageController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router: Router = Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/conversations/:roomId", protectRoute, getMessages);
router.post("/conversations/:roomId", protectRoute, sendMessage);
router.post("/start", protectRoute, startConversation);

export default router;
