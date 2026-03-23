import User from "../models/User.js"
import Job from "../models/Job.js"
import TalentMatch from "../models/talentMatch.js"

export const approveRecruiter = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || user.role !== "recruiter") {
      return res.status(404).json({ message: "Recruiter not found" })
    }
    user.isApproved = true
    await user.save()
    res.json({ message: "Recruiter approved successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments()
    const jobs = await Job.countDocuments()
    const applications = await TalentMatch.countDocuments()
    const recruiters = await User.countDocuments({
      role: "recruiter",
      isApproved: true
    })
    const pendingRecruiters = await User.countDocuments({
      role: "recruiter",
      isApproved: false
    })
    res.json({users,jobs,applications,recruiters,pendingRecruiters})
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const getPendingJobs=async(req,res)=>{
  try{
    const jobs=await Job.find({approvalStatus:"pending"})
       .populate("createdBy","name email")
       .sort({createdBy:-1})
      res.json(jobs)
  } catch(err){
  res.status(500).json({message:err.message})
}
}

export const approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: "Job not found" })
    job.approvalStatus = "approved"
    await job.save()
    res.json({ message: "Job approved successfully", job })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const rejectJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: "Job not found" })
    job.approvalStatus = "rejected"
    await job.save()
    res.json({ message: "Job rejected successfully", job })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin accounts" })
    }

    await user.deleteOne()
    res.json({ message: "User removed successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}