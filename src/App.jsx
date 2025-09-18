import { useState, useMemo } from "react"
import ExcelUploader from "./components/ExcelUploader"
import FeedbackPie from "./components/FeedbackPie"

const StatCard = ({ title, value, color }) => (
  <div
    className={`bg-white p-2 rounded-md shadow-sm hover:scale-105 transform transition animate-fadeIn border-l-4 border-${color}-500 w-32`}
  >
    <h3 className="text-gray-500 text-[10px] truncate">{title}</h3>
    <p className={`text-base font-semibold text-${color}-600 mt-1`}>{value}</p>
  </div>
)


export default function App() {
  const [data, setData] = useState([])
  const [poc, setPoc] = useState("")
  const [month, setMonth] = useState("")

  const pocOptions = useMemo(
    () => [...new Set(data.map((d) => d.POC).filter(Boolean))],
    [data]
  )
  const monthOptions = useMemo(
    () =>
      [...new Set(data.map((d) => d.__EMPTY).filter(Boolean))].filter(
        (m) => m !== "Month"
      ),
    [data]
  )

  const filtered = useMemo(() => {
    return data.filter((d) => {
      return (!poc || d.POC === poc) && (!month || d.__EMPTY === month)
    })
  }, [data, poc, month])

  const current = filtered[0] || {}

  const totalResumes = Number(current["Number of resumes"]) || 0
  const totalSelects =
    (Number(current["__EMPTY_3"]) || 0) +
    (Number(current["__EMPTY_6"]) || 0) +
    (Number(current["__EMPTY_8"]) || 0) +
    (Number(current["Result"]) || 0)

 const screeningData = {
  "Screening Pending": Number(current["Screening Feedback"]) || 0,
  Duplicate: Number(current["__EMPTY_2"]) || 0,
  Select: Number(current["__EMPTY_3"]) || 0,
  Reject: Number(current["__EMPTY_4"]) || 0,
}

  const interviewData = {
    "L1 Pending": Number(current["__EMPTY_5"]) || 0,
    "L1 Select": Number(current["__EMPTY_6"]) || 0,
    "L1 Reject": Number(current["__EMPTY_7"]) || 0,
    "L2 Select": Number(current["__EMPTY_8"]) || 0,
    "L2 Reject": Number(current["__EMPTY_9"]) || 0,
    "Final Select": Number(current["Result"]) || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
        📊 HR Dashboard
      </h1>

      {/* Upload + Filters */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Excel & Filters</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* Upload */}
          <ExcelUploader onData={setData} />

          {/* Filters (only show when Excel is uploaded) */}
          {data.length > 0 && (
            <div className="flex gap-4">
              <select
                value={poc}
                onChange={(e) => setPoc(e.target.value)}
                className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All POCs</option>
                {pocOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Months</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>


      {/* Placeholder when no data */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="Upload illustration"
            className="w-24 h-24 mb-4 opacity-70"
          />
          <p className="text-lg font-medium">No data uploaded yet</p>
          <p className="text-sm">Upload an Excel file to see insights 🚀</p>
        </div>
      )}

      {/* Stat Cards */}
{data.length > 0 && filtered.length > 0 && (
  <div className="space-y-6 mb-8">
   {/* Counts */}
<div>
  <h2 className="text-sm font-bold text-gray-700 mb-2">Counts</h2>
  <div className="flex flex-wrap gap-3">
    <StatCard title="Total Resumes" value={totalResumes} color="blue" />
    <StatCard 
      title="Pending" 
      value={totalResumes > 0 ? screeningData["Screening Pending"] : "0"} 
      color="orange" 
    />
    <StatCard title="Screen Selects" value={totalSelects>0? totalSelects:"0"} color="green" />
    <StatCard 
      title="Final Selects" 
      value={screeningData.Select > 0 ? interviewData["Final Select"] : "0"} 
      color="purple" 
    />
  </div>
</div>

{/* Percentages */}
<div>
  <h2 className="text-sm font-bold text-gray-700 mb-2">Percentages</h2>
  <div className="flex flex-wrap gap-3">
    <StatCard 
      title="Final Status (%)" 
      value={
        screeningData.Select > 0 
          ? ((interviewData["Final Select"] / screeningData.Select) * 100).toFixed(1) + "%" 
          : "0%"
      } 
      color="purple" 
    />
    <StatCard 
      title="Pending (%)" 
      value={
        totalResumes > 0 
          ? ((screeningData["Screening Pending"] / totalResumes) * 100).toFixed(1) + "%" 
          : "0%"
      } 
      color="orange" 
    />
    <StatCard 
      title="Screening Feedback (%)" 
      value={
        totalResumes > 0 
          ? ((screeningData.Select / totalResumes) * 100).toFixed(1) + "%" 
          : "0%"
      } 
      color="green" 
    />
  </div>
</div>
  </div > 
    
)}


      {/* Charts */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-fadeIn">
            <FeedbackPie
              title="📝 Screening Feedback"
              data={screeningData}
              colors={["#3B82F6", "#60A5FA", "#10B981", "#F87171"]}
            />
          </div>
          <div className="animate-fadeIn delay-200">
            <FeedbackPie
              title="🎤 Interview Feedback"
              data={interviewData}
              colors={[
                "#FBBF24",
                "#8B5CF6",
                "#3B82F6",
                "#10B981",
                "#F87171",
                "#EC4899",
              ]}
            />
          </div>
        </div>
      ) : (
        data.length > 0 && (
          <p className="text-gray-600 text-center">
            No data found for selected filters.
          </p>
        )
      )}
    </div>
  )
}
