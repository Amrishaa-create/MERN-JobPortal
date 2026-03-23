import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { getSavedJobs,saveJob,removeSavedJob } from "../controllers/savedJobController.js"

const router=express.Router()

router.get("/my",protect,getSavedJobs)
router.post("/",protect,saveJob)
router.delete("/:jobId",protect,removeSavedJob)

export default router