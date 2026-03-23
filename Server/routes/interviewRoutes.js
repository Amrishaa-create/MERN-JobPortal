import express from "express"
import {protect,recruiterOnly} from "../middleware/authMiddleware.js"
import {getMyInterviews,scheduleInterview,getRecruiterInterviews} from "../controllers/interviewController.js"

const router = express.Router()

router.get("/my",protect,getMyInterviews)
router.get("/recruiter", protect, recruiterOnly, getRecruiterInterviews)
router.post("/schedule-interview",protect,recruiterOnly,scheduleInterview)

export default router