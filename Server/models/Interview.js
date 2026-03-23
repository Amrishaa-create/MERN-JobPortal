import mongoose from "mongoose"
const interviewSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: Date, required: true },

  type: { 
    type: String, 
    enum: ["Online", "Onsite"], 
    default: "Online" 
  },

  status: { 
    type: String, 
    enum: ["Scheduled", "Completed", "Cancelled"], 
    default: "Scheduled" 
  },

  link: { type: String }, 
  location: { type: String }, 

  round: {
    type: String,
    enum: ["HR", "Technical", "Manager"],
    default: "Technical"
  },

  notes: { type: String },

  duration: { type: Number }

}, { timestamps: true })
export default mongoose.model('Interview', interviewSchema)