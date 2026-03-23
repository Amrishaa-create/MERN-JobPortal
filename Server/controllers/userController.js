import User from "../models/User.js"
import fs from "fs"

export const getProfile = async (req, res) => {
  try {
    const user = await User
      .findById(req.user._id)
      .select("-password")
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })

  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    if (req.body.name) {
      user.name = req.body.name
    }

    if (user.role === "candidate") {
      if (req.body.skills) {
        user.skills = Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills.split(",").map(s => s.trim()).filter(Boolean)
      }
      if (req.body.experience!==undefined) {
        user.experience = req.body.experience
      }
      if (req.body.location!==undefined) {
        user.location = req.body.location
      }
    }
    if (user.role === "recruiter" && req.body.companyName) {
      user.companyName = req.body.companyName
    }
    const updatedUser = await user.save()
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User
      .findById(req.params.id)
      .select("-password")
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getAllCandidates = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can view candidates"
      })
    }
    const candidates = await User
      .find({ role: "candidate" })
      .select("-password")
    res.json(candidates)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({
      message: "Account deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect"
      })
    }
    user.password = newPassword
    await user.save()
    res.json({
      message: "Password updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })

  }
}

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can upload resume" })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
     if (user.resume && fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume)
    }
    user.resume = req.file.path
    await user.save()
    res.json({
      message: "Resume uploaded successfully",
      resume: user.resume
    })
  } catch (error) {
    res.status(500).json({ message: "Upload failed" })
  }
}

export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    if (user.resume && fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume)
    }
    user.resume = null
    await user.save()
    res.json({ message: "Resume deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  console.log("req.user:", req.user)
  try {
    const users = await User.find().select("-password")
    console.log("Users fetched:", users.length)
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};