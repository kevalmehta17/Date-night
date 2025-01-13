import express from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.put("/update", protectRoute, updateRoute);

export default router;
