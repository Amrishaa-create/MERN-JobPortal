import { useEffect, useState } from "react"
import { getMyJobs, deleteJob } from "../../services/jobService"
import { Trash2, Plus, Pencil, Eye, Users, Briefcase, MapPin, BadgeDollarSign } from "lucide-react"
import CreateJobModal from "../../components/jobs/CreateModal"
import ViewModal from "../../components/jobs/ViewModal"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { Search } from "lucide-react"

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [viewJob, setViewJob] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => { loadJobs() }, [])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await getMyJobs()
      console.log("FIRST JOB:",data[0])
      console.log("SKILLs:",data[0]?.requiredSkills,data[0].skills)
      setJobs(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (job) => { setEditJob(job); setOpenModal(true) }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return
    try {
      await deleteJob(id)
      setJobs(prev => prev.filter(job => job._id !== id))
    } catch (err) { console.log(err) }
  }

  const handleCreated = (job) => setJobs(prev => [job,...prev])
  const handleUpdated = (updated) => setJobs(prev => prev.map(j => j._id === updated._id ? updated : j))

  const filtered = jobs.filter(job => {
    const matchSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" ||
      (filter === "open" && job.status === "Open") ||
      (filter === "closed" && job.status === "Closed") ||
      (filter === "pending" && job.approvalStatus === "pending") ||
      (filter === "approved" && job.approvalStatus === "approved") ||
      (filter === "rejected" && job.approvalStatus === "rejected")
    return matchSearch && matchFilter
  })

  const counts = {
    all: jobs.length,
    open: jobs.filter(j => j.status === "Open").length,
    approved: jobs.filter(j => j.approvalStatus === "approved").length,
    pending: jobs.filter(j => j.approvalStatus === "pending").length,
    rejected: jobs.filter(j => j.approvalStatus === "rejected").length,
  }

  const accentColors = [
    "border-l-blue-400", "border-l-violet-400", "border-l-emerald-400",
    "border-l-orange-400", "border-l-pink-400"
  ]

  const filterTabs = [
    { key: "all", label: "All Jobs" }, { key: "open", label: "Open" },
    { key: "approved", label: "Approved" }, { key: "pending", label: "Pending" },
    { key: "rejected", label: "Rejected" }
  ]

  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full min-h-screen bg-gray-50/80 px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-2xl font-semibold text-blue-500 uppercase tracking-[0.2em] mb-1">Recruiter Panel</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tight">My Jobs</h1>
          <p className="text-2xl text-gray-400 mt-2 font-medium">
            {jobs.length} total · {counts.approved} approved · {counts.pending} pending
          </p>
        </div>
        <Button
          variant="primary"
          size="xl"
          onClick={() => { setEditJob(null); setOpenModal(true) }}
          className="self-start md:self-auto"
        >
          <Plus size={24} /> Post New Job
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by title, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-4 rounded-2xl text-xl font-black transition flex items-center gap-2 ${
                filter === tab.key
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className={`text-xl px-2 py-0.5 rounded-full font-black ${
                filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab.key] ?? filtered.length}
              </span>
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-white border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <Briefcase size={36} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-gray-300">
            {search ? "No jobs match your search" : "No jobs posted yet"}
          </p>
          <p className="text-gray-400 text-xl mt-2">
            {search ? "Try different keywords" : "Click 'Post New Job' to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((job, i) => {
            const skills = job.requiredSkills?.length > 0
              ? job.requiredSkills
              : job.skills?.length > 0
              ? job.skills
              : []

            return (
            <div
              key={job._id}
              className={`bg-white border border-gray-100 border-l-4 ${accentColors[i % accentColors.length]} rounded-3xl p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={26} className="text-blue-500" />
                  </div>
                  <Badge label={job.status || "Open"} size="xl" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
                  {job.title}
                </h2>
                <div className="mb-4">
                  <Badge
                    label={
                      job.approvalStatus === "approved" ? "Approved" :
                      job.approvalStatus === "rejected" ? "Rejected" : "Pending"
                    }
                    size="xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={24} className="text-gray-400 flex-shrink-0" />
                    <span className="text-base md:text-2xl font-medium text-gray-600">{job.location || "Not set"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <BadgeDollarSign size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-base md:text-2xl font-medium text-gray-600">
                      {job.salary ? `₹${Number(job.salary).toLocaleString()}` : "Not specified"}
                    </span>
                  </div>
                  {job.applicantsCount !== undefined && (
                    <div className="flex items-center gap-2.5">
                      <Users size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-base md:text-2xl font-medium text-gray-600">{job.applicantsCount} Applicants</span>
                    </div>
                  )}
                </div>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skills.slice(0, 3).map((skill, j) => (
                        <span key={j} className="text-2xl font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-xl">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-xl text-gray-400 font-medium self-center">
                          +{skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                <p className="text-2xl text-gray-400 font-medium">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setViewJob(job); setOpenViewModal(true) }}
                    className="w-11 h-11 !p-0 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <Eye size={26} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}
                    className="w-11 h-11 !p-0 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white">
                    <Pencil size={26} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job._id)}
                    className="w-11 h-11 !p-0 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash2 size={26} />
                  </Button>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}

      <CreateJobModal
        open={openModal}
        onClose={() => { setOpenModal(false); setEditJob(null) }}
        onCreated={handleCreated}
        editJob={editJob}
        onUpdated={handleUpdated}
      />
      <ViewModal open={openViewModal} onClose={() => setOpenViewModal(false)} job={viewJob} />
    </div>
  )
}

export default Jobs