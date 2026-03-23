import API from './api'

export const getMyJobs=async() =>{
    const res=await API.get('/recruiter/jobs/my/jobs')
    return res.data.map(job=>({
        ...job,
        requiredSkills:job.requiredSkills||job.skills||[]
    }))
}

export const createJob=async(jobData)=>{
    const res=await API.post('/recruiter/jobs',jobData)
    return res.data
}

export const updateJob=async(id,jobData)=>{
    const res=await API.put(`/recruiter/jobs/${id}`,jobData)
    return res.data
}

export const deleteJob=async(id)=>{
    const res=await API.delete(`/recruiter/jobs/${id}`)
    return res.data
}

export const getJobById=async(id)=>{
    const res=await API.get(`/recruiter/jobs/${id}`)
    return res.data
}