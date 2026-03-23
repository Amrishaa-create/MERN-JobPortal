import talentMatch from '../models/talentMatch.js'
import Job from '../models/Job.js'
import User from '../models/User.js'

export const applyJob = async (req, res) => {
  try {
    if (req.user.role != 'candidate') {
      return res.status(403).json({ message: 'Candidate only' })
    }
    const job = await Job.findById(req.params.jobId)
    if (!job) {
      return res.status(404).json({ message: 'job not found' })
    }
    if (job.status == 'Closed') {
      return res.status(404).json({ message: 'Job is closed' })
    }
    const existing = await talentMatch.findOne({
      job: job._id,
      candidate: req.user._id
    })
    if (existing) {
      return res.status(400).json({ message: 'Already Applied' })
    }
    const user = await User.findById(req.user._id)
     if (!user) return res.status(404).json({ message: 'User not found' })
    if (!user.resume) {
      return res.status(400).json({
        message: 'Please upload resume in profile first'
      })
    }
    const jobSkills = (job.requiredSkills || []).map(skill =>
      skill.toLowerCase().trim()
    )
    const userSkills = (user.skills || []).map(skill =>
      skill.toLowerCase().trim()
    )

    let percentage = 0
    if (jobSkills.length > 0) {
      const matched = jobSkills.filter(s => userSkills.includes(s))
      percentage = Number(((matched.length / jobSkills.length) * 100).toFixed(2))
    }

    const status = percentage >= 60 ? 'Shortlisted' : 'Pending'

    const match = await talentMatch.create({
      job: job._id,
      candidate: user._id,
      matchScore: percentage,
      status,
      resume: user.resume
    })

    res.status(201).json({
      message: 'Application submitted successfully',
      matchScore: percentage,
      status,
      matchId: match._id
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyMatches=async(req,res)=>{
    try{
    const matches=await talentMatch.find({
        candidate:req.user._id
    })
    .populate('job','title company location status salary requiredSkills')
    .sort({createdAt:-1})
    res.json(matches)
}catch(error){
    res.status(500).json({message:error.message})
}
}

export const getJobCandidates = async (req,res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Recruiter only' })
    }
    const job = await Job.findById(req.params.jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    const matches = await talentMatch.find({
      job: req.params.jobId
    })
      .populate('candidate', 'name email skills')
      .sort({ matchScore: -1 })
    res.json(matches)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllCandidates = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Recruiter only' })
    }
     const jobs = await Job.find({ createdBy: req.user._id }).select('_id')
    const jobIds = jobs.map(j => j._id)
    const matches = await talentMatch.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email skills resume experience location')
      .sort({ createdAt: -1 })

    const seen = new Set()
    const candidates = []
    for (const match of matches) {
      if (match.candidate && !seen.has(match.candidate._id.toString())) {
        seen.add(match.candidate._id.toString())
        candidates.push({
          ...match.candidate.toObject(),
          stage: match.status,
          matchScore: match.matchScore
        })
      }
    }
    res.json(candidates)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllMatches = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Recruiter only' })
    }
    const matches = await talentMatch.find()
      .populate("candidate", "name email")
      .populate("job", "title");
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getRecruiterApplications = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Recruiter only" });
    }
    const jobs = await Job.find({ createdBy: req.user._id }).select("_id title");
    const jobIds = jobs.map((job) => job._id);
    const applications = await talentMatch.find({ job: { $in: jobIds } })
      .populate("job", "title company requiredSkills")
      .populate("candidate", "name email skills resume") 
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching recruiter applications:", err.message);
    res.status(500).json({ message: err.message });
  }
}