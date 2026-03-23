import { useEffect, useState } from "react"
import Layout from "../../components/layout/Layout"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {MapPin, BadgeDollarSign, Briefcase, Star,ArrowLeft, CheckCircle, Send, Building2, AlertCircle} from "lucide-react"

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [error,setError]=useState("")
  useEffect(() => { fetchJob() }, [])
  const fetchJob = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4500/api/candidate/jobs/${id}`,
        { withCredentials: true }
      )
      setJob(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const applyJob = async () => {
    setApplying(true)
    try {
      await axios.post(
        `http://localhost:4500/api/candidate/matches/${id}/apply`,
        {},
        { withCredentials: true }
      )
      setApplied(true)
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Application failed")
    } finally {
      setApplying(false)
    }
  }
  if (!job) {
    return (
      <Layout>
        <div
          style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
          className="px-4 md:px-8 py-6"
        >
          <div className="space-y-5 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-2xl w-1/2" />
            <div className="h-72 bg-slate-200 rounded-3xl" />
            <div className="h-48 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-6 max-w-4xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold text-2xl transition"
        >
          <ArrowLeft size={24} /> Back to Jobs
        </button>
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Briefcase size={30} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Building2 size={24} className="text-slate-400" />
                <p className="text-xl md:text-2xl font-semibold text-slate-500">{job.company}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4">
              <MapPin size={24} className="text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-2xl font-black text-slate-800">{job.location || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4">
              <BadgeDollarSign size={24} className="text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Salary</p>
                <p className="text-2xl font-black text-slate-800">
                  {job.salary ? `₹${Number(job.salary).toLocaleString()}` : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4">
              <Briefcase size={24} className="text-sky-500 flex-shrink-0" />
              <div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-wider">Status</p>
                <p className="text-2xl font-black text-emerald-600">{job.status || "Open"}</p>
              </div>
            </div>
          </div>
          {job.requiredSkills?.length > 0 && (
            <div className="mb-6">
              <p className="text-xl font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star size={24} /> Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-xl text-2xl font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-5">
              <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-2xl">{error}</p>
                {error.toLowerCase().includes("resume") && (
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-2xl font-bold text-red-500 hover:underline mt-1 block"
                  >
                    Go to Profile to upload your resume
                  </button>
                )}
                {error.toLowerCase().includes("already") && (
                  <button
                    onClick={() => navigate("/applications")}
                    className="text-2xl font-bold text-red-500 hover:underline mt-1 block"
                  >
                    View your applications
                  </button>
                )}
              </div>
            </div>
          )}
          <button
            onClick={applyJob}
            disabled={applied || applying}
            className={`
              w-full flex items-center justify-center gap-3
              py-5 rounded-2xl text-2xl font-black transition-all
              ${applied
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                : applying
                ? "bg-indigo-400 text-white cursor-not-allowed opacity-70"
                : "bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
              }
            `}
          >
            {applied ? (
              <><CheckCircle size={24} /> Application Submitted!</>
            ) : applying ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : (
              <><Send size={24} /> Apply Now</>
            )}
          </button>
        </div>
        {job.description && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-5">
              Job Description
            </h2>
            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed whitespace-pre-line font-medium">
              {job.description}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default JobDetails