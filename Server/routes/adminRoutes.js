import express from 'express'
import { approveRecruiter, getAdminStats, deleteUser } from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/stats", protect, adminOnly, getAdminStats)
router.put("/approve/:id", protect, adminOnly, approveRecruiter)
router.delete("/users/:id", protect, adminOnly, deleteUser)

export default router