import { useState } from "react"
import Layout from "../../components/layout/Layout"
import axios from "axios"
import { Shield, Trash2, Lock, Eye, EyeOff, X, AlertTriangle, CheckCircle } from "lucide-react"

function Settings() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" })
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [success, setSuccess] = useState(false)
  const changePassword = async () => {
    setLoading(true)
    try {
      await axios.put("/users/change-password", form, { withCredentials: true })
      setSuccess(true)
      setTimeout(() => { setOpen(false); setSuccess(false); setForm({ currentPassword: "", newPassword: "" }) }, 2000)
    } catch (error) {
      alert(error.response?.data?.message || "Error updating password")
    } finally {
      setLoading(false)
    }
  }
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return
    try {
      await axios.delete("/users/me", { withCredentials: true })
      window.location.href = "/login"
    } catch (error) {
      alert("Error deleting account")
    }
  }

  return (
    <Layout>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
        className="px-4 md:px-8 py-6 space-y-8 max-w-3xl"
      >
        <div>
          <p className="text-2xl font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Candidate Portal</p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">Settings</h1>
          <p className="text-2xl text-slate-400 mt-2 font-medium">Manage your account preferences</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Shield size={26} className="text-indigo-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">Security</h2>
              <p className="text-2xl text-slate-400 mt-1">Keep your account secure with a strong password</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-black text-slate-800">Password</p>
              <p className="text-2xl text-slate-400">Last updated recently</p>
            </div>
            <button onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl text-2xl font-black transition-all hover:shadow-xl hover:shadow-indigo-500/25 self-start sm:self-auto">
              <Lock size={24} /> Change Password
            </button>
          </div>
        </div>
        <div className="bg-white border border-red-100 rounded-3xl p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={26} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-red-600">Danger Zone</h2>
              <p className="text-2xl text-slate-400 mt-1">These actions are permanent and cannot be undone</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-black text-slate-800">Delete Account</p>
              <p className="text-2xl text-slate-400">Permanently remove your account and all data</p>
            </div>
            <button onClick={deleteAccount}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl text-2xl font-black transition-all self-start sm:self-auto">
              <Trash2 size={26} /> Delete Account
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100"
          >
            {success ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Password Updated!</h2>
                <p className="text-slate-400 text-2xl">Your password has been changed successfully.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between p-7 pb-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Change Password</h2>
                    <p className="text-2xl text-slate-400 mt-0.5">Enter your current and new password</p>
                  </div>
                  <button onClick={() => setOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
                    <X size={26} />
                  </button>
                </div>
                <div className="p-7 space-y-5">
                  <div>
                    <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showCurrent ? "text" : "password"}
                        placeholder="Enter current password"
                        value={form.currentPassword}
                        onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-12 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                        {showCurrent ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xl font-black text-slate-500 uppercase tracking-wider mb-2 block">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showNew ? "text" : "password"}
                        placeholder="Enter new password"
                        value={form.newPassword}
                        onChange={e => setForm({ ...form, newPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-12 pr-12 py-4 rounded-2xl text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-medium"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                        {showNew ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-4 rounded-2xl text-2xl transition">
                      Cancel
                    </button>
                    <button onClick={changePassword} disabled={loading || !form.currentPassword || !form.newPassword}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-2xl transition hover:shadow-xl hover:shadow-indigo-500/25">
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                      ) : "Update Password"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Settings