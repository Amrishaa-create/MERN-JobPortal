import Job from "../models/Job.js"
import TalentMatch from "../models/talentMatch.js"
import Interview from '../models/Interview.js'

export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user._id
    const jobs = await Job.find({ createdBy: recruiterId }).select('_id')
    const jobIds = jobs.map(j => j._id)
    const totalJobs = jobs.length

    const totalApplications = await TalentMatch.countDocuments({
      job:{$in:jobIds}
    })
    const uniqueCandidates = await TalentMatch.distinct('candidate', {
      job: { $in: jobIds }
    })
    const totalInterviews = await Interview.countDocuments({
      recruiter: recruiterId
    })

    res.json({
      jobs: totalJobs,
      applications: totalApplications,
      candidates: uniqueCandidates.length,
      interviews: totalInterviews
    })

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats"
    })
  }
}