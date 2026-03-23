import express from "express"
import {applyJob,getMyMatches} from '../controllers/matchController.js'
import {protect,candidateOnly} from '../middleware/authMiddleware.js'

const router=express.Router()
router.post('/:jobId/apply',protect,candidateOnly,applyJob)
router.get('/my',protect,candidateOnly,getMyMatches)

export default router