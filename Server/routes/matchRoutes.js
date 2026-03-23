import express from 'express'
import {
  applyJob,
  getMyMatches,
  getJobCandidates,
  getAllCandidates,
  getRecruiterApplications,
  getAllMatches
} from '../controllers/matchController.js'

import { protect, candidateOnly, recruiterOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:jobId/apply', protect, candidateOnly, applyJob)
router.get('/my', protect, candidateOnly, getMyMatches)
router.get('/job/:jobId', protect, recruiterOnly, getJobCandidates)
router.get('/all', protect, recruiterOnly, getAllCandidates)
router.get('/applications', protect, recruiterOnly, getRecruiterApplications)
router.get('/matches/all', protect, recruiterOnly, getAllMatches)

export default router