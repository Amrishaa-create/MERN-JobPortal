import { useState } from "react"
import JobCard from "./JobCard"
import { Briefcase, Search, SlidersHorizontal, X } from "lucide-react"

function JobList({ jobs = [] }) {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const filters = [
    { key: "all",     label: "All Jobs" },
    { key: "remote",  label: "Remote" },
    { key: "onsite",  label: "On-site" },
    { key: "full",    label: "Full-time" },
    { key: "part",    label: "Part-time" }
  ]
  const filtered = jobs.filter(job => {
    const matchSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "remote" && job.location?.toLowerCase().includes("remote")) ||
      (activeFilter === "onsite" && !job.location?.toLowerCase().includes("remote")) ||
      (activeFilter === "full" && job.type?.toLowerCase().includes("full")) ||
      (activeFilter === "part" && job.type?.toLowerCase().includes("part"))
    return matchSearch && matchFilter
  })

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 pl-13 pl-12 pr-12 py-4 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition"
            >
              <X size={24} />
            </button>
          )}
        </div>
        <button className="sm:hidden w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
          <SlidersHorizontal size={24} />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`
              px-5 py-3 rounded-2xl text-2xl font-black transition-all
              ${activeFilter === f.key
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800"
              }
            `}
          >
            {f.label}
            {f.key === "all" && (
              <span className={`ml-2 text-lg px-2 py-0.5 rounded-full font-black ${
                activeFilter === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {jobs.length}
              </span>
            )}
          </button>
        ))}
      </div>
      {search && (
        <p className="text-2xl font-semibold text-slate-400">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
          <span className="text-indigo-500 font-black ml-1">"{search}"</span>
        </p>
      )}
      {filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <Briefcase size={36} className="text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-slate-300">
            {search ? "No jobs match your search" : "No jobs available"}
          </p>
          <p className="text-slate-400 text-lg mt-2">
            {search ? "Try different keywords or clear the search" : "Check back soon for new openings"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-6 px-6 py-3 bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-600 transition text-base"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((job, index) => (
            <JobCard key={job._id || job.id || index} job={job} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

export default JobList