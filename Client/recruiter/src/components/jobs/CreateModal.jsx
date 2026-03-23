import { useState, useEffect } from "react"
import { Briefcase, MapPin, BadgeDollarSign, FileText, Star, Plus } from "lucide-react"
import { createJob, updateJob } from "../../services/jobService"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

const CreateJobModal = ({ open, onClose, onCreated, editJob, onUpdated }) => {
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", salary: "", skills: [] })
  const [skillInput, setSkillInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev=>({ ...prev, [e.target.name]: e.target.value }))
  }
  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault()
      e.stopPropagation()
      const trimmed=skillInput.trim()
      setForm(prev=>{
        if(prev.skills.includes(trimmed)) return prev
        return {...prev,skills:[...prev.skills,trimmed]}
      })
      setSkillInput("")
    }
  }
  const removeSkill = (skill) => {
    setForm(prev =>({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }
  useEffect(() => {
    if (editJob) {
      setForm({ 
        title: editJob.title || "", 
        company: editJob.company || "", 
        location: editJob.location || "", 
        description: editJob.description || "", 
        salary: editJob.salary || "", skills: 
        editJob.requiredSkills || [] })
    } else {
      setForm({ title: "", company: "", location: "", description: "", salary: "", skills: [] })
    }
  }, [editJob, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
        const payload = {
          title: form.title,
          company: form.company,
          location: form.location,
          description: form.description,
          salary: form.salary,
          requiredSkills: form.skills
        }
    try {
      if (editJob) {
        const updated = await updateJob(editJob._id, payload)
        onUpdated(updated)
      } else {
        const job = await createJob(payload)
        onCreated(job)
      }
      onClose()
      setForm({ title: "", company: "", location: "", description: "", salary: "", skills: [] })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editJob ? "Update Job" : "Post a Job"}
      subtitle={editJob ? "Update your job posting details" : "Fill in the details to post a new job"}
      size="xl"
      footer={
        <>
          <Button variant="secondary" size="xl" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" size="xl" loading={loading} onClick={handleSubmit} className="flex-1">
            <Plus size={24} /> {editJob ? "Update Job" : "Post Job"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Job Title"
          name="title"
          placeholder="e.g. Senior Frontend Developer"
          value={form.title}
          onChange={handleChange}
          icon={Briefcase}
          required
        />
        <Input
          label="Company Name"
          name="company"
          placeholder="e.g. Google, Infosys, TCS"
          value={form.company}
          onChange={handleChange}
          icon={Briefcase}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location"
            name="location"
            placeholder="e.g. Chennai, Remote"
            value={form.location}
            onChange={handleChange}
            icon={MapPin}
            required
          />
          <Input
            label="Salary"
            name="salary"
            type="number"
            placeholder="e.g. 800000"
            value={form.salary}
            onChange={handleChange}
            icon={BadgeDollarSign}
          />
        </div>

        <div>
          <label className="text-xl font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Star size={24} /> Required Skills
            <span className="text-gray-400 normal-case font-normal">(press Enter to add)</span>
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition min-h-[56px]">
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-2xl font-bold">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}
                    className="w-4 h-4 rounded-full bg-blue-200 hover:bg-red-200 text-blue-700 hover:text-red-600 flex items-center justify-center transition text-2xl font-black">×</button>
                </span>
              ))}
            </div>

            <input
            type="text"
            placeholder={form.skills.length === 0 ? "e.g. React, Node.js, MongoDB..." : "Add more skills..."}
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                e.stopPropagation()
                const trimmed = skillInput.trim()
                if (trimmed && !form.skills.includes(trimmed)) {
                  setForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }))
                  setSkillInput("")
                }
              }
            }}
            className="outline-none bg-transparent text-2xl text-gray-700 placeholder-gray-400 w-full font-medium"
          />
        </div>

         {form.skills.length > 0 && (
            <p className="text-2xl text-blue-500 font-bold mt-1.5">
              {form.skills.length} skill{form.skills.length > 1 ? "s" : ""} added ✓
            </p>
          )}
        </div>

        <Input
          label="Job Description"
          type="textarea"
          name="description"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={form.description}
          onChange={handleChange}
          icon={FileText}
          required
          rows={4}
        />
        </div>
    </Modal>
  )
}

export default CreateJobModal