import Job from '../models/Job.js'

export const createJob = async (req,res)=>{
  try{
  if(req.user.role!=='recruiter')
    return res.status(403).json({message:'Recruiter only'})
  if(!req.user.isApproved)
  {
    return res.status(403).json({messsage:'Admin approval required to post job'})
  }
  const job=await Job.create({
    ...req.body,
    createdBy:req.user._id,
    approvalStatus:"pending"
  })
  res.status(201).json(job)
}catch(error){
  res.status(500).json({message:error.message})
}
}

export const getMyJobs = async (req,res)=>{
  try{
    const jobs = await Job.find({
      createdBy: req.user._id
    })
    res.json(jobs)
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

export const getJobs=async(req,res)=>{
  try{
  const jobs=await Job.find({approvalStatus:"approved"}).populate('createdBy','name')
  res.json(jobs)
}catch(error){
  res.status(500).json({message:error.message})
}
}

export const getJobById=async(req,res)=>{
  try{
  const job=await Job.findById(req.params.id).populate('createdBy','name email')
  if(!job){
    return res.status(404).json({message:'Job not found'})
  }
  res.json(job)
}catch(error){
  res.status(500).json({message:error.message})
}
}

export const updateJob=async(req,res)=>{
  try{
    if(req.user.role!=='recruiter'){
      return res.status(403).json({message:'Recruiter only'})
    }
    const job=await Job.findById(req.params.id)
    if(!job){
      return res.status(404).json({message:'Job not found'})
    }
    if(job.createdBy.toString()!==req.user._id.toString()){
      return res.status(403).json({message:'Not Authorized to update this job'})
    }
    const updatedJob=await Job.findByIdAndUpdate(
      req.params.id,
      {...req.body, approvalStatus:"pending"},
      {new:true}
    )
    res.json(updatedJob)
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

export const deleteJob=async(req,res)=>{
  try{
    if(req.user.role!=='recruiter'){
      return res.status(403).json({message:'Recruiter only'})
    }
    const job=await Job.findById(req.params.id)
    if(!job){
      return res.status(404).json({message:'Job not found'})
    }
    if(job.createdBy.toString()!==req.user._id.toString()){
      return res.status(403).json({message:'Not Authorized to delete this job'})
    }
    await job.deleteOne()
    res.json({message:'Job deleted sucessfully'})
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" ,approvalStatus:"approved"})
      .populate("createdBy","name email")
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteJobAdmin = async (req, res) => {
  try {
    if(req.user.role !== 'admin'){
      return res.status(403).json({ message: 'Admins only' })
    }

    const job = await Job.findById(req.params.id)
    if(!job){
      return res.status(404).json({ message: 'Job not found' })
    }

    await job.deleteOne()
    res.json({ message: 'Job deleted successfully by admin' })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}