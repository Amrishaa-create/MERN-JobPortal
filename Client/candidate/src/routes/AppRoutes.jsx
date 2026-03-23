import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'

import Dashboard from '../pages/dashboard/Dashboard'
import BrowseJobs from '../pages/jobs/BrowseJobs'
import JobDetails from '../pages/jobs/JobDetails'
import Applications from "../pages/applications/Applications"
import SavedJobs from "../pages/saved/SavedJobs"
import InterviewTracker from "../pages/interviews/InterviewTracker"
import Profile from "../pages/profile/Profile"
import Settings from "../pages/settings/Settings"

import ProtectedRoute from "../components/ProtectedRoutes"

function AppRoutes(){

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/jobs" element={<BrowseJobs />} />

          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/applications" element={<Applications />} />

          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/interviews" element={<InterviewTracker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>

    </BrowserRouter>

  )
}

export default AppRoutes