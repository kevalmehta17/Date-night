import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/swipe-right/:likeUserId", protectRoute, swipeRight);
router.post("/swipe-left/:dislikeUserId", protectRoute, swipeLeft);

router.get("/matches", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;
