import express from 'express'
import { getAllJobs, deleteJobAdmin } from '../controllers/jobController.js'
import { getPendingJobs, approveJob, rejectJob } from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/pending', protect, adminOnly, getPendingJobs)
router.get('/', protect, adminOnly, getAllJobs)
router.delete('/:id', protect, adminOnly, deleteJobAdmin)
router.put('/:id/approve', protect, adminOnly, approveJob)
router.put('/:id/reject', protect, adminOnly, rejectJob)

export default router