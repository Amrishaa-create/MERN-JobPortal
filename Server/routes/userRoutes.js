import express from "express"
import { protect, candidateOnly,recruiterOnly ,adminOnly} from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"
import {changePassword} from "../controllers/userController.js"

import {
  getProfile,
  updateProfile,
  getUserById,
  getAllCandidates,
  deleteMyAccount,
  uploadResume,
  deleteResume,
  getAllUsers
} from "../controllers/userController.js"

const router = express.Router()
router.get("/all",protect,adminOnly,getAllUsers)
router.get("/me/candidate", protect, candidateOnly,getProfile)
router.get("/me/recruiter", protect, recruiterOnly,getProfile)
router.get("/me/admin", protect, adminOnly,getProfile)
router.put("/me", protect, updateProfile)
router.get("/candidates", protect, recruiterOnly, getAllCandidates)
router.get("/:id", protect, getUserById)
router.delete("/me", protect, deleteMyAccount)
router.put("/change-password",protect,changePassword)
router.put("/upload-resume",protect,upload.single("resume"),uploadResume)
router.delete("/delete-resume",protect,deleteResume)

export default router