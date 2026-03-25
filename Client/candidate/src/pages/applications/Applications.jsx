import { useState, useEffect } from "react"
import API from "../../services/api"
import Layout from "../../components/layout/Layout"
import ApplicationCard from "../../components/application/ApplicationCard"
import { FileText, Search, X, SlidersHorizontal } from "lucide-react"

function Applications() {
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchApplications() }, [])
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const res = await API.get(
        "/candidate/matches/my",
        { withCredentials: true }
      )
      setApplications(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const filtered = applications.filter(app =>
    (statusFilter === "All" || app.status === statusFilter) &&
    (app.job?.company?.toLowerCase().includes(search.toLowerCase()) ||
     app.job?.title?.toLowerCase().includes(search.toLowerCase()))
  )
  const counts = {
    All: applications.length,
    Pending: applications.filter(a => a.status === "Pending").length,
    Shortlisted: applications.filter(a => a.status === "Shortlisted").length,
    Rejected: applications.filter(a => a.status === "Rejected").length,
  }
  const filters = ["All", "Pending", "Shortlisted", "Rejected"]

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
              My Applications
            </h1>
            <p className="text-2xl text-slate-400 mt-2 font-medium">
              {applications.length} total · {counts.Shortlisted} shortlisted · {counts.Pending} in progress
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
            <FileText size={24} className="text-indigo-500" />
            <span className="text-2xl font-black text-slate-800">{filtered.length} shown</span>
          </div>
        </div>
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total",       value: counts.All,         color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Pending",     value: counts.Pending,     color: "text-amber-600",  bg: "bg-amber-50" },
              { label: "Shortlisted", value: counts.Shortlisted, color: "text-emerald-600",bg: "bg-emerald-50" },
              { label: "Rejected",    value: counts.Rejected,    color: "text-red-600",    bg: "bg-red-50" }
            ].map((s, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <FileText size={24} className={s.color} />
                </div>
                <div>
                  <p className={`text-3xl md:text-4xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-2xl text-slate-400 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-12 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition">
                <X size={24} />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-5 py-4 rounded-2xl text-2xl font-black transition flex items-center gap-2 ${
                  statusFilter === f
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {f}
                <span className={`text-2xl px-2 py-0.5 rounded-full font-black ${
                  statusFilter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {counts[f] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
              <FileText size={36} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-slate-300">
              {search ? "No applications match" : "No applications yet"}
            </p>
            <p className="text-slate-400 text-lg mt-2">
              {search ? "Try different keywords" : "Apply to jobs to see them here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((app, i) => (
              <ApplicationCard
                key={app._id}
                index={i}
                application={{
                  ...app,
                  company: app.job?.company,
                  role: app.job?.title,
                  date: app.createdAt,
                  jobId: app.job?._id
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Applications