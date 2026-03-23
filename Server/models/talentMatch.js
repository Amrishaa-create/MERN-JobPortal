import mongoose from 'mongoose'

const talentMatchSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Accepted','Pending','Shortlisted','Rejected'],
      default: 'Pending',
    },
    matchScore: {
      type: Number,
      default: 0
    },
    resume: {
      type: String
    }
    
  },
  { timestamps: true }
)
talentMatchSchema.index({job:1,candidate:1},{unique:true})
export default mongoose.model('TalentMatch', talentMatchSchema)