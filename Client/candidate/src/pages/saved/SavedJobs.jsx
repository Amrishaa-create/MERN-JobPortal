import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {Bookmark, BookmarkX, Briefcase, MapPin,BadgeDollarSign, ArrowRight} from "lucide-react"

const accentColors = [
  "border-l-indigo-400", "border-l-sky-400", "border-l-emerald-400",
  "border-l-violet-400", "border-l-pink-400", "border-l-amber-400"
]
function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const navigate = useNavigate()
  useEffect(() => { fetchSavedJobs() }, [])
  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/saved-jobs/my", { withCredentials: true })
      setSavedJobs(res.data.filter(item => item.job !== null && item.job !== undefined))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const removeJob = async (jobId) => {
    if (!jobId) return
    setRemoving(jobId)
    try {
      await axios.delete(`https://api-mern-jobportal.onrender.com/saved-jobs/${jobId}`, { withCredentials: true })
      setSavedJobs(savedJobs.filter(j => j.job?._id !== jobId))
    } catch (error) {
      console.log(error)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
              Candidate Portal
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
              Saved Jobs
            </h1>
            <p className="text-2xl text-slate-400 mt-2 font-medium">
              {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} bookmarked
            </p>
          </div>
          {!loading && savedJobs.length > 0 && (
            <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
              <Bookmark size={24} className="text-indigo-500" />
              <span className="text-2xl font-black text-slate-800">{savedJobs.length} saved</span>
            </div>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
              <Bookmark size={36} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-slate-300">No saved jobs yet</p>
            <p className="text-slate-400 text-2xl mt-2">Bookmark jobs while browsing to see them here</p>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-6 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-4 rounded-2xl font-black text-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/25 mx-auto"
            >
              <Briefcase size={24} /> Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedJobs.filter(item => item.job).map((item, i) => (
              <div
                key={item._id}
                className={`bg-white border border-slate-100 border-l-4 ${accentColors[i % accentColors.length]} rounded-3xl p-7 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={26} className="text-indigo-500" />
                    </div>
                    <button
                      onClick={() => removeJob(item.job?._id)}
                      disabled={removing === item.job?._id}
                      className="w-11 h-11 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition border border-red-100 flex-shrink-0"
                      title="Remove from saved"
                    >
                      {removing === item.job?._id
                        ? <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        : <BookmarkX size={24} />
                      }
                    </button>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-1">
                    {item.job?.title || "Untitled Job"}
                  </h2>
                  <p className="text-lg md:text-2xl font-semibold text-slate-400 mb-4">
                    {item.job?.company || "Unknown Company"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.job?.location && (
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
                        <MapPin size={24} className="text-slate-400" />
                        {item.job.location}
                      </span>
                    )}
                    {item.job?.salary && (
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-2xl font-bold px-3 py-1.5 rounded-xl">
                        <BadgeDollarSign size={24} className="text-slate-400" />
                        ₹{Number(item.job.salary).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/jobs/${item.job?._id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-2xl text-2xl font-black transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 group-hover:gap-3"
                  >
                    View Job
                    <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SavedJobs