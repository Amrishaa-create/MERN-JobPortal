import express from 'express'
import { getJobCandidates, getAllCandidates, getRecruiterApplications, getAllMatches } from '../controllers/matchController.js'
import { protect, recruiterOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/job/:jobId', protect, recruiterOnly, getJobCandidates)
router.get('/all', protect, recruiterOnly, getAllCandidates)
router.get('/applications', protect, recruiterOnly, getRecruiterApplications)
router.get('/matches/all', protect, recruiterOnly, getAllMatches)

export default router