import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConversation,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute); // Apply the protectRoute middleware to all routes

router.post("/send", sendMessage); // Route to send a message
router.get("/conversation/:userId", getConversation); // Route to get conversation

export default router;
