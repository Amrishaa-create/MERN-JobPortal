import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Briefcase, MapPin, BadgeDollarSign, Bookmark,
  BookmarkCheck, ArrowRight, Search, X
} from "lucide-react"

const accentColors = [
  { border: "border-l-indigo-400", icon: "bg-indigo-50", iconText: "text-indigo-500" },
  { border: "border-l-sky-400",    icon: "bg-sky-50",    iconText: "text-sky-500" },
  { border: "border-l-emerald-400",icon: "bg-emerald-50",iconText: "text-emerald-500" },
  { border: "border-l-violet-400", icon: "bg-violet-50", iconText: "text-violet-500" },
  { border: "border-l-pink-400",   icon: "bg-pink-50",   iconText: "text-pink-500" },
  { border: "border-l-amber-400",  icon: "bg-amber-50",  iconText: "text-amber-500" },
]
function BrowseJobs() {
  const [jobs, setJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [savingId, setSavingId] = useState(null)
  const navigate = useNavigate()
  useEffect(() => { fetchJobs(); fetchSavedJobs() }, [])
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/candidate/jobs")
      const normalized = res.data.map(job => ({
      ...job,
      requiredSkills: job.requiredSkills || job.skills || []
    }))
      setJobs(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/saved-jobs/my", { withCredentials: true })
      setSavedJobs(res.data.map(item => item.job._id))
    } catch (error) {
      console.log(error)
    }
  }
  const toggleSaveJob = async (jobId) => {
    setSavingId(jobId)
    try {
      if (savedJobs.includes(jobId)) {
        await axios.delete(`http://localhost:4500/api/saved-jobs/${jobId}`, { withCredentials: true })
        setSavedJobs(savedJobs.filter(id => id !== jobId))
      } else {
        await axios.post("http://localhost:4500/api/saved-jobs", { jobId }, { withCredentials: true })
        setSavedJobs([...savedJobs, jobId])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSavingId(null)
    }
  }
  const filtered = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-8"
      >
        <div>
          <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
            Candidate Portal
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
            Browse Jobs
          </h1>
          <p className="text-2xl text-slate-400 mt-2 font-medium">
            {jobs.length} opportunities available · Find your perfect role
          </p>
        </div>
        <div className="relative max-w-2xl">
          <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 pl-14 pr-12 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition">
              <X size={24} />
            </button>
          )}
        </div>
        {search && (
          <p className="text-2xl font-semibold text-slate-400">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
            <span className="text-indigo-500 font-black ml-1">"{search}"</span>
          </p>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
              <Briefcase size={36} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-slate-300">
              {search ? "No jobs match your search" : "No jobs available"}
            </p>
            <p className="text-slate-400 text-2xl mt-2">
              {search ? "Try different keywords" : "Check back soon for new openings"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((job, i) => {
              const c = accentColors[i % accentColors.length]
              const isSaved = savedJobs.includes(job._id)
              return (
                <div key={job._id}
                  className={`bg-white border border-slate-100 border-l-4 ${c.border} rounded-3xl p-7 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
                        <Briefcase size={26} className={c.iconText} />
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job._id)}
                        disabled={savingId === job._id}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition font-bold border ${
                          isSaved
                            ? "bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                        }`}
                        title={isSaved ? "Unsave" : "Save job"}
                      >
                        {isSaved
                          ? <BookmarkCheck size={24} />
                          : <Bookmark size={24} />
                        }
                      </button>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-1">
                      {job.title}
                    </h2>
                    <p className="text-lg md:text-2xl font-semibold text-slate-400 mb-4">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
                          <MapPin size={13} className="text-slate-400" /> {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
                          <BadgeDollarSign size={13} className="text-slate-400" />
                          ₹{Number(job.salary).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {(() => {
                      const skills = job.requiredSkills?.length > 0
                      ? job.requiredSkills
                      : job.skills?.length > 0
                      ? job.skills
                      : []
                      return skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.slice(0, 3).map((skill, j) => (
                          <span key={j} className="text-2xl font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl">
                            {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-xs text-slate-400 font-medium self-center">
                              +{skills.length - 3}
                              </span>
                            )}
                            </div>
                            ) : null
                            })()}
                    {job.description && (
                      <p className="text-2xl text-slate-400 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-2xl text-2xl font-black transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 group-hover:gap-3"
                    >
                      View Details
                      <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default BrowseJobs