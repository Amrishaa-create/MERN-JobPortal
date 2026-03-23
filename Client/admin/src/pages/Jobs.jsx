import { useEffect, useState } from "react"
import {
  Briefcase, Clock, CheckCircle, XCircle,
  Trash2, Building2, MapPin, BadgeDollarSign,
  User, Search
} from "lucide-react"
import API from "../services/api"

const AdminJobs = () => {
  const [jobs, setJobs] = useState([])
  const [pendingJobs, setPendingJobs] = useState([])
  const [tab, setTab] = useState("pending")
  const [acting, setActing] = useState(null)
  const [search, setSearch] = useState("")
  const fetchJobs = async () => {
    try {
      const res = await API.get("/admin/jobs")
      setJobs(res.data)
    } catch (err) { console.error(err) }
  }
  const fetchPendingJobs = async () => {
    try {
      const res = await API.get("/admin/jobs/pending")
      setPendingJobs(res.data)
    } catch (err) { console.error(err) }
  }
  useEffect(() => { fetchJobs(); fetchPendingJobs() }, [])
  const handleDelete = async (jobId) => {
    if (!confirm("Delete this job permanently?")) return
    setActing(jobId)
    try {
      await API.delete(`/admin/jobs/${jobId}`)
      setJobs(jobs.filter(j => j._id !== jobId))
    } catch (err) { console.error(err) }
    finally { setActing(null) }
  }
  const handleApprove = async (jobId) => {
    setActing(jobId)
    try {
      await API.put(`/admin/jobs/${jobId}/approve`)
      const approved = pendingJobs.find(j => j._id === jobId)
      if (approved) {
        setPendingJobs(pendingJobs.filter(j => j._id !== jobId))
        setJobs(prev => [...prev, { ...approved, approvalStatus: "approved" }])
      }
    } catch (err) { console.error(err) }
    finally { setActing(null) }
  }
  const handleReject = async (jobId) => {
    setActing(jobId)
    try {
      await API.put(`/admin/jobs/${jobId}/reject`)
      const rejected = pendingJobs.find(j => j._id === jobId)
      if (rejected) {
        setPendingJobs(pendingJobs.filter(j => j._id !== jobId))
        setJobs(prev => [...prev, { ...rejected, approvalStatus: "rejected" }])
      }
    } catch (err) { console.error(err) }
    finally { setActing(null) }
  }
  const statusConfig = {
    approved: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", icon: <CheckCircle size={12} /> },
    pending:  { bg: "bg-yellow-500/15",  text: "text-yellow-400",  border: "border-yellow-500/20",  icon: <Clock size={12} /> },
    rejected: { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/20",     icon: <XCircle size={12} /> }
  }
  const StatusBadge = ({ status }) => {
    const c = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xl font-bold border ${c.bg} ${c.text} ${c.border}`}>
        {c.icon} {status}
      </span>
    )
  }
  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
  )
  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredPending = pendingJobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
  )
  const JobCard = ({ job, isPending = false }) => (
    <div className={`bg-[#1a1d27] border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-white/20 hover:-translate-y-0.5 hover:shadow-2xl duration-300 ${
      isPending ? "border-yellow-500/30" : "border-white/5"
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Briefcase size={24} className="text-blue-400" />
          </div>
          <StatusBadge status={job.approvalStatus || "pending"} />
        </div>
        <h2 className="text-3xl font-black text-white mb-1 leading-tight">{job.title}</h2>
        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2 text-2xl">
            <Building2 size={24} className="text-gray-600 flex-shrink-0" />
            <span className="font-semibold text-gray-400">{job.company}</span>
          </div>
          <div className="flex items-center gap-2 text-2xl">
            <MapPin size={24} className="text-gray-600 flex-shrink-0" />
            <span className="text-gray-500">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-2xl">
            <BadgeDollarSign size={24} className="text-gray-600 flex-shrink-0" />
            <span className="text-gray-500">
              {job.salary ? `₹${Number(job.salary).toLocaleString()}` : "Not specified"}
            </span>
          </div>
          {job.createdBy && (
            <div className="flex items-center gap-2 text-2xl bg-white/3 rounded-xl px-3 py-2 mt-2">
              <User size={24} className="text-blue-500 flex-shrink-0" />
              <div>
                <span className="text-blue-400 font-bold">{job.createdBy?.name || "Unknown Recruiter"}</span>
                {job.createdBy?.email && (
                  <span className="text-gray-600 ml-2 text-xl">{job.createdBy.email}</span>
                )}
              </div>
            </div>
          )}
        </div>
        {job.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.requiredSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-2xl font-bold bg-white/5 text-gray-400 border border-white/10 px-2.5 py-1 rounded-lg">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 3 && (
              <span className="text-2xl text-gray-600 self-center">+{job.requiredSkills.length - 3}</span>
            )}
          </div>
        )}
        {job.description && (
          <p className="text-gray-600 text-2xl mt-3 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>
      <div className="mt-5">
        {isPending ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(job._id)}
              disabled={acting === job._id}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 py-3 rounded-xl transition font-bold text-2xl disabled:opacity-50"
            >
              {acting === job._id ? <Spinner /> : <CheckCircle size={24} />}
              Approve
            </button>
            <button
              onClick={() => handleReject(job._id)}
              disabled={acting === job._id}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 py-3 rounded-xl transition font-bold text-2xl disabled:opacity-50"
            >
              {acting === job._id ? <Spinner /> : <XCircle size={24} />}
              Reject
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleDelete(job._id)}
              disabled={acting === job._id}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 py-3 rounded-xl transition font-bold text-2xl disabled:opacity-50"
            >
              {acting === job._id ? <Spinner /> : <Trash2 size={24} />}
              Delete Job
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="w-full min-h-screen bg-[#0f1117] text-white px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Admin Panel</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
            Manage Jobs
          </h1>
          <p className="text-gray-500 text-2xl mt-2">
            {jobs.length} total jobs · {pendingJobs.length} pending review
          </p>
        </div>
        {pendingJobs.length > 0 && (
          <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-5 py-3 rounded-2xl">
            <Clock size={24} className="text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-black text-2xl">
              {pendingJobs.length} need approval
            </span>
          </div>
        )}
      </div>
      <div className="relative max-w-xl">
        <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by job title, company or recruiter..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1a1d27] border border-white/10 text-white placeholder-gray-600 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:border-blue-500 transition"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setTab("pending")}
          className={`px-6 py-3 rounded-2xl font-black text-2xl transition flex items-center gap-2 ${
            tab === "pending"
              ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20"
              : "bg-[#1a1d27] text-gray-400 border border-white/10 hover:border-white/20"
          }`}
        >
          <Clock size={24} /> Pending Approval
          {pendingJobs.length > 0 && (
            <span className={`text-2xl px-2 py-0.5 rounded-full font-black ${
              tab === "pending" ? "bg-white/20" : "bg-red-500 text-white"
            }`}>
              {pendingJobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-6 py-3 rounded-2xl font-black text-2xl transition flex items-center gap-2 ${
            tab === "all"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-[#1a1d27] text-gray-400 border border-white/10 hover:border-white/20"
          }`}
        >
          <Briefcase size={24} /> All Jobs
          <span className={`text-2xl px-2 py-0.5 rounded-full font-black ${
            tab === "all" ? "bg-white/20" : "bg-white/5 text-gray-500"
          }`}>
            {jobs.length}
          </span>
        </button>
      </div>
      {tab === "pending" && (
        filteredPending.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-gray-600">All jobs reviewed!</p>
            <p className="text-gray-700 mt-2">No pending approvals right now</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPending.map(job => (
              <JobCard key={job._id} job={job} isPending />
            ))}
          </div>
        )
      )}
      {tab === "all" && (
        filteredJobs.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-gray-600" />
            </div>
            <p className="text-2xl font-black text-gray-600">No jobs found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default AdminJobs