import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import axios from "axios"
import {Mail, User, Briefcase, MapPin, Star, Edit3,Upload, Trash2, FileText, X, CheckCircle, Plus} from "lucide-react"

function Sparkles({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
    </svg>
  )
}
function Profile() {
  const [user, setUser] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")
  const [form, setForm] = useState({ name: "", skills: "", experience: "", location: "" })

  useEffect(() => { fetchProfile() }, [])
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "/users/me/candidate",
        { withCredentials: true }
      )
      const userData = res.data?.user || res.data
      setUser(userData)
      setForm({
        name: userData.name || "",
        skills: userData.skills?.join(", ") || "",
        experience: userData.experience || "",
        location: userData.location || ""
      })
    } catch (error) { console.log(error) }
  }
  const updateProfile = async () => {
    setSaving(true)
    try {
      const skillsArray = form.skills
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : []
      await axios.put(
        "/api/users/me",
        { name: form.name, skills: skillsArray, experience: form.experience, location: form.location },
        { withCredentials: true }
      )
      setUser(prev => ({
        ...prev,
        name: form.name,
        skills: skillsArray,
        experience: form.experience,
        location: form.location
      }))
      setEditOpen(false)
      showToast("Profile updated successfully!")
    } catch (error) {
      console.log(error)
      showToast("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }
  const uploadResume = async () => {
    if (!resumeFile) { alert("Please select a file"); return }
    const formData = new FormData()
    formData.append("resume", resumeFile)
    try {
      setUploading(true)
      const res = await axios.put(
        "/users/upload-resume",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      const resumePath = res.data?.resume || res.data?.user?.resume
      if (resumePath) {
        setUser(prev => ({ ...prev, resume: resumePath }))
      } else {
        await fetchProfile()
      }
      setResumeFile(null)
      showToast("Resume uploaded successfully!")
    } catch (error) {
      console.log(error)
      showToast("Resume upload failed")
    } finally {
      setUploading(false)
    }
  }
  const deleteResume = async () => {
    if (!window.confirm("Delete your resume?")) return
    try {
      await axios.delete(
        "/users/delete-resume",
        { withCredentials: true }
      )
      setUser(prev => ({ ...prev, resume: null }))
      showToast("Resume deleted")
    } catch (error) {
      console.log(error)
    }
  }
  const completion =
    (user?.name ? 25 : 0) +
    (user?.skills?.length ? 25 : 0) +
    (user?.experience ? 25 : 0) +
    (user?.location ? 25 : 0)
  const completionColor =
    completion >= 75 ? "bg-emerald-500" :
    completion >= 50 ? "bg-indigo-500" : "bg-amber-500"
  if (!user) return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-6 animate-pulse"
      >
        <div className="h-12 bg-slate-200 rounded-2xl w-1/3" />
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-3xl" />
          ))}
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-6 max-w-6xl"
      >
        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-2xl animate-pulse">
            <CheckCircle size={24} className="text-emerald-400" />
            {toast}
          </div>
        )}
        <div>
          <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
            Candidate Portal
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
            My Profile
          </h1>
          <p className="text-2xl text-slate-400 mt-2 font-medium">
            Manage your personal information
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900">Profile Completion</h3>
              <p className="text-2xl text-slate-400 mt-0.5">
                Complete your profile to get better job matches
              </p>
            </div>
            <span className={`text-3xl font-black ${
              completion >= 75 ? "text-emerald-600" :
              completion >= 50 ? "text-indigo-600" : "text-amber-600"
            }`}>
              {completion}%
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${completionColor} rounded-full transition-all duration-1000`}
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <p className="text-2xl text-slate-400 mt-3 font-medium">
              {completion === 0 ? "Add your name to get started" :
               completion <= 25 ? "Add your skills to improve matches" :
               completion <= 50 ? "Add your experience level" :
               "Add your location to complete your profile"}
            </p>
          )}
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-4xl font-black flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">{user?.name}</h2>
              <p className="text-2xl text-slate-400 mt-1">{user?.email}</p>
              <span className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 text-2xl font-black rounded-xl border border-indigo-100">
                <Sparkles size={24} /> Candidate
              </span>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-2xl text-2xl font-black transition-all hover:shadow-xl hover:shadow-indigo-500/25 self-start md:self-auto"
            >
              <Edit3 size={24} /> Edit Profile
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-lg transition">
            <h3 className="text-3xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <User size={24} className="text-indigo-500" />
              </div>
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <User size={24} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Name</p>
                  <p className="text-2xl font-black text-slate-800">{user?.name || "Not added"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <Mail size={24} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-2xl font-semibold text-slate-700 truncate">{user?.email}</p>
                </div>
              </div>
              {user?.location && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <MapPin size={24} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-2xl font-black text-slate-800">{user.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-lg transition">
            <h3 className="text-3xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Star size={24} className="text-violet-500" />
              </div>
              Skills
              {user?.skills?.length > 0 && (
                <span className="ml-auto text-2xl font-black text-violet-500 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                  {user.skills.length}
                </span>
              )}
            </h3>
            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-2xl font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <Plus size={24} className="text-slate-400" />
                </div>
                <p className="text-2xl text-slate-400 font-medium">No skills added yet</p>
                <button
                  onClick={() => setEditOpen(true)}
                  className="text-indigo-500 font-black text-2xl mt-2 hover:underline"
                >
                  Add skills
                </button>
              </div>
            )}
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-lg transition">
            <h3 className="text-3xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Briefcase size={24} className="text-emerald-500" />
              </div>
              Professional
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <Briefcase size={16} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Experience</p>
                  <p className="text-2xl font-black text-slate-800">
                    {user?.experience || "Not added"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <MapPin size={24} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-2xl font-black text-slate-800">
                    {user?.location || "Not added"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-lg transition sm:col-span-2 xl:col-span-3">
            <h3 className="text-3xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                <FileText size={24} className="text-sky-500" />
              </div>
              Resume
              {!user?.resume && (
                <span className="ml-auto text-2xl font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                  Required to apply for jobs
                </span>
              )}
            </h3>
            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
              <div className="flex-1">
                {user?.resume ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <CheckCircle size={24} className="text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl font-black text-emerald-700">Resume Uploaded</p>
                      <a
                        href={`https://api-mern-jobportal.onrender.com/${user.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl text-emerald-600 hover:underline font-semibold"
                      >
                        View current resume
                      </a>
                    </div>
                    <button
                      onClick={deleteResume}
                      className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition border border-red-100"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
                    <FileText size={24} className="text-slate-400 flex-shrink-0" />
                    <p className="text-2xl font-semibold text-slate-400">No resume uploaded yet</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl text-2xl font-black cursor-pointer transition">
                  <FileText size={24} />
                  {resumeFile ? resumeFile.name.slice(0, 15) + "..." : "Choose File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => setResumeFile(e.target.files[0])}
                  />
                </label>
                <button
                  onClick={uploadResume}
                  disabled={uploading || !resumeFile}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-2xl text-2xl font-black transition hover:shadow-xl hover:shadow-indigo-500/25"
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <><Upload size={24} /> Upload</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {editOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between p-7 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Edit Profile</h2>
                  <p className="text-2xl text-slate-400 mt-0.5">Update your personal information</p>
                </div>
                <button
                  onClick={() => setEditOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-7 space-y-4">
                {[
                  { label: "Full Name",   key: "name",       placeholder: "Your full name",          icon: User },
                  { label: "Skills",      key: "skills",     placeholder: "React, Node.js, Python...",icon: Star },
                  { label: "Experience",  key: "experience", placeholder: "e.g. 2 years, Fresher",   icon: Briefcase },
                  { label: "Location",    key: "location",   placeholder: "City, Country",            icon: MapPin }
                ].map(field => {
                  const Icon = field.icon
                  return (
                    <div key={field.key}>
                      <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Icon size={24} /> {field.label}
                        {field.key === "skills" && (
                          <span className="normal-case font-normal text-slate-400">(comma separated)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 px-5 py-3.5 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-3 px-7 pb-7">
                <button
                  onClick={() => setEditOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-4 rounded-2xl text-2xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateProfile}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-black py-4 rounded-2xl text-2xl transition hover:shadow-xl hover:shadow-indigo-500/25"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Profile