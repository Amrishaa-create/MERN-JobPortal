import express from "express"
import { getCandidateDashboard } from "../controllers/candidatedashController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getCandidateDashboard)

export default router