import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const candidateToken = req.cookies.candidateToken
    const recruiterToken = req.cookies.recruiterToken
    const adminToken = req.cookies.adminToken

    let token

    if (req.originalUrl.includes("/api/auth/me/candidate")) {
      token = candidateToken
    }
    else if (req.originalUrl.includes("/api/auth/me/recruiter")) {
      token = recruiterToken
    }
    else if (req.originalUrl.includes("/api/auth/me/admin")) {
      token = adminToken
    }
    else if (req.originalUrl.includes("/api/auth/logout")) {
      token = adminToken || recruiterToken || candidateToken
    }

    else if (req.originalUrl.includes("/api/users/upload-resume")) {
      token = candidateToken
    }
    else if (req.originalUrl.includes("/api/users/delete-resume")) {
      token = candidateToken  
    }
    else if (req.originalUrl.includes("/api/users/me/candidate")) {
      token = candidateToken
    }
    else if (req.originalUrl.includes("/api/users/me/recruiter")) {
      token = recruiterToken
    }
    else if (req.originalUrl.includes("/api/users/me/admin")) {
      token = adminToken
    }
    else if (req.originalUrl.includes("/api/users/change-password")) {
      token = candidateToken || recruiterToken || adminToken
    }
    else if (req.originalUrl.includes("/api/users/all")) {
      token = adminToken
    }
    else if (req.originalUrl.includes("/api/users/me")) {
      token = candidateToken || recruiterToken || adminToken
    }
    else if (req.originalUrl.includes("/api/users")) {
      token = adminToken || recruiterToken || candidateToken
    }

    else if (req.originalUrl.includes("/api/admin")) {
      token = adminToken
    }
    else if (req.originalUrl.includes("/api/recruiter")) {
      token = recruiterToken
    }
    else if (req.originalUrl.includes("/api/candidate")) {
      token = candidateToken
    }

    else if (req.originalUrl.includes("/api/interviews")) {
      if (
        req.originalUrl.includes("/recruiter") ||
        req.originalUrl.includes("/schedule-interview")
      ) {
        token = recruiterToken
      } else {
        token = candidateToken
      }
    }

    else {
      token = adminToken || recruiterToken || candidateToken
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    req.tokens = {
      candidate: candidateToken,
      recruiter: recruiterToken,
      admin: adminToken
    }

    next()
  } catch (error) {
    console.error("Auth error:", error.message)
    return res.status(401).json({ message: "Not authorized" })
  }
}

export const recruiterOnly = (req, res, next) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Recruiter only' })
  }
  next()
}

export const candidateOnly = (req, res, next) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Candidate only' })
  }
  next()
}

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' })
  }
  next()
}