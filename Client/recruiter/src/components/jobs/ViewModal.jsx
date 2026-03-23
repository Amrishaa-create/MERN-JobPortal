import { MapPin, BadgeDollarSign, Users, FileText, Briefcase, Star } from "lucide-react"
import Modal from "../../components/ui/Modal"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
const ViewModal = ({ open, onClose, job }) => {
  if (!open || !job) return null
  const skills = job.requiredSkills?.length > 0
    ? job.requiredSkills
    : job.skills?.length > 0
    ? job.skills
    : []

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      footer={
        <Button variant="primary" size="lg" fullWidth onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge label={job.status || "Open"} size="md" />
          {job.approvalStatus && (
            <Badge
              label={
                job.approvalStatus === "approved" ? "Approved" :
                job.approvalStatus === "rejected" ? "Rejected" : "Pending"
              }
              size="md"
            />
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{job.title}</h2>
        <p className="text-2xl text-gray-400 mt-1 font-medium">{job.company}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4">
          <MapPin size={24} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-xl font-black text-gray-400 uppercase tracking-wider">Location</p>
            <p className="text-xl font-black text-gray-800">{job.location || "Not specified"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4">
          <BadgeDollarSign size={24} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-xl font-black text-gray-400 uppercase tracking-wider">Salary</p>
            <p className="text-xl font-black text-gray-800">
              {job.salary ? `${Number(job.salary).toLocaleString()}` : "Not specified"}
            </p>
          </div>
        </div>
        {job.applicantsCount !== undefined && (
          <div className="flex items-center gap-3 bg-blue-50 rounded-2xl px-5 py-4">
            <Users size={24} className="text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xl font-black text-blue-400 uppercase tracking-wider">Applicants</p>
              <p className="text-xl font-black text-blue-700">{job.applicantsCount} Applied</p>
            </div>
          </div>
        )}
        {job.createdAt && (
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4">
            <Briefcase size={24} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xl font-black text-gray-400 uppercase tracking-wider">Posted On</p>
              <p className="text-xl font-black text-gray-800">
                {new Date(job.createdAt).toLocaleDateString([], {
                  month: "short", day: "numeric", year: "numeric"
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      {skills.length > 0 && (
        <div className="mb-5">
          <p className="text-xl font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Star size={24} /> Required Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-xl font-bold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {job.description && (
        <div>
          <p className="text-xl font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText size={24} /> Job Description
          </p>
          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-base md:text-2xl text-gray-700 leading-relaxed whitespace-pre-line font-medium">
              {job.description}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ViewModal