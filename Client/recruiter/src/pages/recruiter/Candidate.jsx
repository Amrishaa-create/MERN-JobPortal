import { useEffect, useState } from "react"
import API from "../../services/api"
import { Users, Star, Mail, Briefcase, TrendingUp, Search } from "lucide-react"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const Candidate = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await API.get("recruiter/matches/all")
        setCandidates(data.candidates || data || [])
      } catch (err) {
        console.error("Error fetching candidates:", err)
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [])
  const filtered = candidates.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )
  const avatarColors = [
    "from-blue-500 to-cyan-400", "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400", "from-orange-500 to-amber-400",
    "from-pink-500 to-rose-400", "from-indigo-500 to-blue-400"
  ]
  const accentColors = [
    "border-l-blue-400", "border-l-violet-400", "border-l-emerald-400",
    "border-l-orange-400", "border-l-pink-400", "border-l-indigo-400"
  ]

  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full min-h-screen bg-gray-50/80 px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-2xl font-semibold text-blue-500 uppercase tracking-[0.2em] mb-1">Recruiter Panel</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tight">Candidates</h1>
          <p className="text-2xl text-gray-400 mt-2 font-medium">{candidates.length} total candidates in your pipeline</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
          <Users size={24} className="text-blue-500" />
          <span className="text-2xl font-black text-gray-800">{filtered.length} shown</span>
        </div>
      </div>
      <div className="max-w-2xl">
        <Input
          placeholder="Search by name, email or skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={Search}
        />
      </div>
      {!loading && candidates.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Candidates", value: candidates.length, color: "text-blue-600", bg: "bg-blue-50", icon: <Users size={24} className="text-blue-500" /> },
            { label: "Shortlisted", value: candidates.filter(c => c.stage === "Shortlisted").length, color: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp size={24} className="text-emerald-500" /> },
            { label: "With Skills", value: candidates.filter(c => c.skills?.length > 0).length, color: "text-violet-600", bg: "bg-violet-50", icon: <Star size={24} className="text-violet-500" /> },
            { label: "With Resume", value: candidates.filter(c => c.resume).length, color: "text-orange-600", bg: "bg-orange-50", icon: <Briefcase size={24} className="text-orange-500" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>{stat.icon}</div>
              <div>
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-2xl text-gray-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-72 rounded-3xl bg-white border border-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <Users size={36} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-gray-300">{search ? "No candidates match" : "No candidates yet"}</p>
          <p className="text-gray-400 text-xl mt-2">{search ? "Try different keywords" : "Candidates who apply will appear here"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <div key={c._id}
              className={`bg-white border border-gray-100 border-l-4 ${accentColors[i % accentColors.length]} rounded-3xl p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-2xl font-black flex-shrink-0`}>
                    {c.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{c.name || "Unknown"}</h2>
                    {c.email && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Mail size={22} className="text-gray-400" />
                        <span className="text-xl text-gray-400 truncate max-w-[180px]">{c.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {c.skills?.length > 0 ? (
                  <div className="mb-4">
                    <p className="text-xl font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Star size={22} /> Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {c.skills.slice(0, 4).map((skill, j) => (
                        <span key={j} className="text-2xl font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl">{skill}</span>
                      ))}
                      {c.skills.length > 4 && <span className="text-xl text-gray-400 font-medium self-center">+{c.skills.length - 4} more</span>}
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl text-gray-400 mb-4 italic">No skills listed</p>
                )}

                <div className="space-y-2 mb-4">
                  {c.experience && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={22} className="text-gray-400 flex-shrink-0" />
                      <span className="text-base md:text-2xl text-gray-600 font-medium">{c.experience}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Badge label={c.stage || "Applied"} size="xl" />
                {c.resume ? (
                  <a href={`http://localhost:4500/${c.resume}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="xl">
                      <Briefcase size={22} /> Resume
                    </Button>
                  </a>
                ) : (
                  <span className="text-xl text-gray-400 font-medium">No resume</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Candidate