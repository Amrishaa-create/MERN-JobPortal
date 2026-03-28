import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dns from 'node:dns/promises'
import connectDB from './config/db.js'
import path from 'path'

import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import adminJobRoutes from './routes/adminJobRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import candidateMatchRoutes from './routes/candidateMatchRoutes.js'
import recruiterMatchRoutes from './routes/recruiterMatchRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import candidatedashRoutes from './routes/candidatedashRoutes.js'
import savedJobRoutes from './routes/savedJobRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'

dotenv.config()
dns.setServers(['1.1.1.1','8.8.8.8'])
connectDB()

const app=express()
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  "https://mern-job-portal-vpk1.vercel.app",
  "https://mern-job-portal-o3sm.vercel.app",
  "https://mern-job-portal-elsq.vercel.app"
]

app.use(cors({
  origin : allowedOrigins,
  credentials : true
}))

app.use('/api/auth',authRoutes)
app.use('/api/admin/jobs',adminJobRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/users',userRoutes)
app.use('/api/recruiter/jobs', jobRoutes)
app.use('/api/candidate/jobs', jobRoutes)
app.use('/api/candidate/matches', candidateMatchRoutes)
app.use('/api/recruiter/matches', recruiterMatchRoutes)
app.use('/api/recruiter/dashboard',dashboardRoutes)
app.use('/api/admin/dashboard',dashboardRoutes)
app.use('/api/candidate/dashboard',candidatedashRoutes)
app.use('/api/saved-jobs',savedJobRoutes)
app.use('/api/interviews',interviewRoutes)
app.use('/uploads',express.static('uploads'))

const PORT=process.env.PORT||4500
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
