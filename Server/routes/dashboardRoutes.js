import express from "express"
import { getDashboardStats} from "../controllers/dashboardController.js"
import { protect, recruiterOnly, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/stats", protect,recruiterOnly, getDashboardStats)

export default router