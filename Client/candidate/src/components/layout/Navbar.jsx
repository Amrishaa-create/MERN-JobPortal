import { useContext, useState } from "react"
import { Menu, LogOut, Bell, ChevronDown, Search, Sparkles } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import { useLocation } from "react-router-dom"

const pageMeta = {
  "/":             { title: "Dashboard",    emoji: "", sub: "Welcome back! Here's your job hunt overview" },
  "/jobs":         { title: "Browse Jobs",  emoji: "", sub: "Discover opportunities matching your skills" },
  "/applications": { title: "Applications", emoji: "", sub: "Track your job application journey" },
  "/saved-jobs":   { title: "Saved Jobs",   emoji: "", sub: "Jobs you bookmarked for later" },
  "/interviews":   { title: "Interviews",   emoji: "", sub: "Your upcoming interview schedule" },
  "/profile":      { title: "My Profile",   emoji: "", sub: "Manage your personal information" },
  "/settings":     { title: "Settings",     emoji: "", sub: "Customize your experience" }
}

function Navbar({ toggleSidebar }) {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)

  const page = pageMeta[location.pathname] || { title: "HireHub", emoji: "✨", sub: "Candidate Portal" }

  return (
    <header
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{page.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
              {page.title}
            </h1>
          </div>
          <p className="text-2xl text-slate-400 font-medium mt-0.5">{page.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden md:flex w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 items-center justify-center text-slate-500 hover:text-slate-800 transition">
          <Search size={24} />
        </button>
        <button className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition relative">
          <Bell size={24} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-2xl transition"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-2xl font-black text-slate-800 leading-none">
                {user?.name || "Candidate"}
              </p>
              <p className="text-2xl text-slate-400 mt-0.5">Candidate</p>
            </div>
            <ChevronDown size={24} className={`text-slate-400 transition-transform hidden sm:block ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-14 z-20 bg-white border border-slate-100 rounded-2xl shadow-2xl w-56 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={24} className="text-indigo-500" />
                    <span className="text-xl font-black text-indigo-500 uppercase tracking-widest">Candidate</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 truncate">{user?.name || "Candidate"}</p>
                  <p className="text-xl text-slate-400 truncate">{user?.email || ""}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { logout(); setShowDropdown(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-bold text-2xl text-left"
                  >
                    <LogOut size={24} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar