import { useEffect, useState } from "react"
import {
  Search, Shield, Briefcase, User,
  Trash2, Users as UsersIcon, CheckCircle, Clock
} from "lucide-react"
import API from "../services/api"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [removing, setRemoving] = useState(null)
  const [approving, setApproving] = useState(null)
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all")
      setUsers(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  const handleRemove = async (id) => {
    if (!confirm("Are you sure you want to remove this user?")) return
    setRemoving(id)
    try {
      await API.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
    } catch (err) {
      console.log(err)
    } finally {
      setRemoving(null)
    }
  }
  const handleApprove = async (id) => {
    setApproving(id)
    try {
      await API.put(`/admin/approve/${id}`)
      setUsers(users.map(u =>
        u._id === id ? { ...u, isApproved: true } : u
      ))
    } catch (err) {
      console.log(err)
    } finally {
      setApproving(null)
    }
  }
  useEffect(() => { fetchUsers() }, [])
  const pendingRecruiters = users.filter(
    u => u.role === "recruiter" && !u.isApproved
  ).length
  const filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" ? true :
      filter === "pending" ? (u.role === "recruiter" && !u.isApproved) :
      u.role === filter
    return matchFilter && matchSearch
  })
  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === "admin").length,
    recruiter: users.filter(u => u.role === "recruiter").length,
    candidate: users.filter(u => u.role === "candidate").length,
    pending: pendingRecruiters
  }
  const roleConfig = {
    admin:     { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/20", icon: <Shield size={13} /> },
    recruiter: { bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/20",   icon: <Briefcase size={13} /> },
    candidate: { bg: "bg-gray-500/15",   text: "text-gray-400",   border: "border-gray-500/20",   icon: <User size={13} /> }
  }
  const avatarColors = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500"
  ]
  const RoleBadge = ({ role }) => {
    const c = roleConfig[role] || roleConfig.candidate
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xl font-bold border ${c.bg} ${c.text} ${c.border}`}>
        {c.icon} {role}
      </span>
    )
  }
  const StatusBadge = ({ user }) => {
    if (user.role !== "recruiter") return null
    return user.isApproved ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xl font-bold border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
        <CheckCircle size={24} /> Approved
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xl font-bold border bg-yellow-500/15 text-yellow-400 border-yellow-500/20">
        <Clock size={24} /> Pending
      </span>
    )
  }
  const filterTabs = [
    { key: "all",       label: "All" },
    { key: "admin",     label: "Admins" },
    { key: "recruiter", label: "Recruiters" },
    { key: "candidate", label: "Candidates" },
    { key: "pending",   label: "Pending" },
  ]
  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
  )

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="w-full min-h-screen bg-[#0f1117] text-white px-4 md:px-8 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Admin Panel</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
            Manage Users
          </h1>
          <p className="text-gray-500 text-2xl mt-2">
            {users.length} total members · {pendingRecruiters} recruiters pending approval
          </p>
        </div>
        {pendingRecruiters > 0 && (
          <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-5 py-3 rounded-2xl">
            <Clock size={24} className="text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-black text-2xl">
              {pendingRecruiters} recruiter{pendingRecruiters > 1 ? "s" : ""} need approval
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1d27] border border-white/10 text-white placeholder-gray-600 pl-12 pr-5 py-4 rounded-2xl text-2xl focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-4 rounded-2xl text-2xl font-bold transition capitalize flex items-center gap-2 ${
                filter === tab.key
                  ? tab.key === "pending"
                    ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20"
                    : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-[#1a1d27] text-gray-400 border border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : tab.key === "pending" && counts.pending > 0
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-gray-500"
              }`}>
                {counts[tab.key] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#1a1d27] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <UsersIcon size={28} className="text-gray-600" />
          </div>
          <p className="text-2xl font-black text-gray-600">No users found</p>
          <p className="text-gray-700 mt-2">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-[#1a1d27] border border-white/5 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-5 text-left text-3xl font-black text-gray-500 uppercase tracking-[0.15em]">User</th>
                  <th className="px-8 py-5 text-left text-3xl font-black text-gray-500 uppercase tracking-[0.15em]">Role</th>
                  <th className="px-8 py-5 text-left text-3xl font-black text-gray-500 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-8 py-5 text-left text-3xl font-black text-gray-500 uppercase tracking-[0.15em]">Joined</th>
                  <th className="px-8 py-5 text-center text-3xl font-black text-gray-500 uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u._id}
                    className={`border-b border-white/5 transition-colors group ${
                      u.role === "recruiter" && !u.isApproved
                        ? "bg-yellow-500/3 hover:bg-yellow-500/5"
                        : "hover:bg-white/3"
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-2xl font-black flex-shrink-0`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{u.name}</p>
                          <p className="text-2xl text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge user={u} />
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-2xl text-gray-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString([], {
                              month: "short", day: "numeric", year: "numeric"
                            })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {u.role !== "admin" ? (
                        <div className="flex items-center justify-center gap-2">
                          {u.role === "recruiter" && !u.isApproved && (
                            <button
                              onClick={() => handleApprove(u._id)}
                              disabled={approving === u._id}
                              className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition font-bold text-2xl disabled:opacity-50"
                            >
                              {approving === u._id ? <Spinner /> : <CheckCircle size={24} />}
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(u._id)}
                            disabled={removing === u._id}
                            className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition font-bold text-2xl disabled:opacity-50"
                          >
                            {removing === u._id ? <Spinner /> : <Trash2 size={24} />}
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-700 text-lg flex justify-center">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {filtered.map((u, i) => (
              <div
                key={u._id}
                className={`bg-[#1a1d27] border rounded-2xl p-5 ${
                  u.role === "recruiter" && !u.isApproved
                    ? "border-yellow-500/30"
                    : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-2xl font-black`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-black text-white truncate">{u.name}</p>
                    <p className="text-2xl text-gray-500 truncate">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                {u.role === "recruiter" && (
                  <div className="flex items-center justify-between mb-3 p-3 bg-white/3 rounded-xl">
                    <span className="text-2xl text-gray-400 font-semibold">Approval Status</span>
                    <StatusBadge user={u} />
                  </div>
                )}
                {u.role !== "admin" && (
                  <div className="flex gap-2">
                    {u.role === "recruiter" && !u.isApproved && (
                      <button
                        onClick={() => handleApprove(u._id)}
                        disabled={approving === u._id}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition font-bold text-2xl"
                      >
                        {approving === u._id ? <Spinner /> : <CheckCircle size={24} />}
                        Approve Recruiter
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(u._id)}
                      disabled={removing === u._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl hover:bg-red-500 hover:text-white transition font-bold text-2xl"
                    >
                      {removing === u._id ? <Spinner /> : <Trash2 size={24} />}
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Users