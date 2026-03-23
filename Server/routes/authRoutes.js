import express from 'express'
import { signup, login, logout, getMe } from '../controllers/authController.js'
import { protect, candidateOnly, recruiterOnly, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.post('/logout', protect, logout)

router.get('/me/candidate', protect, candidateOnly, getMe)
router.get('/me/recruiter', protect, recruiterOnly, getMe)
router.get('/me/admin', protect, adminOnly, getMe)

export default router