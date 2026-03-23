import SavedJob from "../models/SavedJobs.js"

export const getSavedJobs=async(req,res)=>{
    const jobs=await SavedJob.find({user:req.user._id}).populate("job")
    res.json(jobs)
}

export const saveJob=async(req,res)=>{
    const saved=await SavedJob.create({
        user:req.user._id,
        job:req.body.jobId
})
res.json(saved)
}

export const removeSavedJob=async (req,res)=>{
    await SavedJob.findOneAndDelete({
        user:req.user._id,
        job:req.params.jobId
})
res.json({message:"Removed"})
}