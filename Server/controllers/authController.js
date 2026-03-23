import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

const getCookieOptions = () => ({
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain:"localhost",
})

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' })

    if (role === 'recruiter' && (!skills || skills.length === 0))
      return res.status(400).json({ message: 'Recruiter must specify company skills focus' })

    const userExists = await User.findOne({ email })
    if (userExists)
      return res.status(400).json({ message: 'User already exists' })

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin cannot signup manually' })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate',
      skills: skills || [],
    })

    const token = generateToken(user._id, user.role)
    const cookieName = user.role === "candidate" ? "candidateToken" : "recruiterToken"

    res.cookie(cookieName, token, getCookieOptions())

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid Credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid Credentials' })

    const token = generateToken(user._id, user.role)
    let cookieName = ""
    if (user.role === "candidate") cookieName = "candidateToken"
    else if (user.role === "recruiter") cookieName = "recruiterToken"
    else if (user.role === "admin") cookieName = "adminToken"

    res.cookie(cookieName, token, getCookieOptions())

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = (req, res) => {
  if (!req.user) return res.status(400).json({ message: "No user logged in" })

  const role = req.user.role
  const cookieName =
    role === "admin" ? "adminToken" :
    role === "recruiter" ? "recruiterToken" :
    "candidateToken"

  res.clearCookie(cookieName, getCookieOptions())
  res.status(200).json({ message: `${role} logged out successfully` })
}

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user })
}