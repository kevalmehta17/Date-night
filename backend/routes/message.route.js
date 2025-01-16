import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConversation,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute); // this middleware first runs the protectRoute function then the function below
// ex:- router.post("/send",protectRoute ,sendMessage);

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation);

export default router;
