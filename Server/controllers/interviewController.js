import Interview from "../models/Interview.js"

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview
      .find({ candidate: req.user._id })
      .populate("job", "title company")
      .populate("recruiter", "name email")
      .sort({ date: 1 })

    res.json(interviews)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const scheduleInterview = async (req, res) => {
  try {
    const { candidate, job, date, type } = req.body
    if (!candidate || !job || !date) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const interview = await Interview.create({
      candidate,
      job,
      recruiter: req.user._id,
      date,
      type
    })

    res.status(201).json(interview)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview
      .find({ recruiter: req.user._id })
      .populate("candidate", "name email")
      .populate("job", "title company")
      .sort({ date: 1 });

    res.json(interviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};