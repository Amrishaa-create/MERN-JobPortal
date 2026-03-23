import express from 'express'
import {createJob,getMyJobs,getJobById,updateJob,deleteJob,getAllJobs} from '../controllers/jobController.js'
import { protect, recruiterOnly} from '../middleware/authMiddleware.js'

const router = express.Router()
router.get('/my/jobs', protect, recruiterOnly, getMyJobs)
router.get('/', getAllJobs)
router.get('/:id', getJobById)

router.post('/', protect, recruiterOnly, createJob)
router.put('/:id', protect, recruiterOnly, updateJob)
router.delete('/:id', protect, recruiterOnly,deleteJob)

export default router