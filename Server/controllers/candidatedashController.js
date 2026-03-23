import TalentMatch from "../models/talentMatch.js"
import Job from "../models/Job.js"

export const getCandidateDashboard = async (req, res) => {

  try {

    const candidateId = req.user._id
    const applications = await TalentMatch.countDocuments({
      candidate: candidateId
    })
    const interviews = await TalentMatch.countDocuments({
      candidate: candidateId,
      status: "interview"
    })
    const recentApplications = await TalentMatch
      .find({ candidate: candidateId })
      .populate("job", "title company location")
      .sort({ createdAt: -1 })
      .limit(5)
    const recommendedJobs = await Job
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title company location salary")

    const applicationsChart = await TalentMatch.aggregate([
      {
        $match: { candidate: candidateId }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ])

    res.json({
      stats: {
        applications,
        interviews
      },
      recentApplications,
      recommendedJobs,
      applicationsChart
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error fetching candidate dashboard data"
    })
  }
}