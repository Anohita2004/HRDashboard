import { useState, useMemo } from "react"
import ExcelUploader from "./components/ExcelUploader"
import FeedbackPie from "./components/FeedbackPie"

const StatCard = ({ title, value, color }) => (
  <div
    className={`w-36 bg-gray-800/40 backdrop-blur-xl border border-${color}-500/40 
                shadow-lg shadow-${color}-500/20 p-4 rounded-2xl 
                hover:scale-105 transition transform duration-300`}
  >
    <h3 className="text-gray-300 text-xs mb-1 truncate">{title}</h3>
    <p className={`text-lg font-bold text-${color}-400`}>{value}</p>
    {/* optional progress bar for percentage cards */}
    {String(value).includes("%") && (
      <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
        <div
          className={`bg-${color}-500 h-1 rounded-full`}
          style={{ width: value }}
        ></div>
      </div>
    )}
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
      [...new Set(data.map((d) => d.__EMPTY).filter(Boolean))]
        .filter((m) => m !== "Month" && m !== "Total"), // remove invalids
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black 
                text-white p-8 animate-gradient">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
          📊 HR Dashboard
        </h1>

        {/* Upload + Filters */}
        <div className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-700">
          <div className="flex items-center gap-3 flex-wrap">
            <ExcelUploader onData={setData} />

            {data.length > 0 && (
              <>
                <span className="text-sm font-medium text-gray-300">Filters:</span>

                <select
                  value={poc}
                  onChange={(e) => setPoc(e.target.value)}
                  className="p-2 rounded-lg bg-gray-800/70 text-white border border-gray-600 
                             focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition"
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
                  className="p-2 rounded-lg bg-gray-800/70 text-white border border-gray-600 
                             focus:ring-2 focus:ring-pink-500 hover:border-pink-400 transition"
                >
                  <option value="">All Months</option>
                  {monthOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder when no data */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400 bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700 animate-fadeIn">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          {/* Counts */}
          <div>
            <h2 className="text-sm font-bold text-gray-300 mb-3">Tabs</h2>
            <div className="flex flex-wrap gap-4">
              <StatCard title="Total Resumes" value={totalResumes} color="blue" />
              <StatCard
                title="Pending"
                value={totalResumes > 0 ? screeningData["Screening Pending"] : "0"}
                color="orange"
              />
              <StatCard
                title="Screen Selects"
                value={totalSelects > 0 ? totalSelects : "0"}
                color="green"
              />
              <StatCard
                title="Final Selects"
                value={screeningData.Select > 0 ? interviewData["Final Select"] : "0"}
                color="purple"
              />
            </div>
          </div>

          {/* Percentages */}
          <div>
            <h2 className="text-sm font-bold text-gray-300 mb-3">Conversion</h2>
            <div className="flex flex-wrap gap-4">
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
              <StatCard
                title="Final Status (%)"
                value={
                  screeningData.Select > 0
                    ? ((interviewData["Final Select"] / screeningData.Select) * 100).toFixed(1) + "%"
                    : "0%"
                }
                color="purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-fadeIn bg-gray-800/40 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 shadow-md">
            <FeedbackPie
              title="📝 Screening Feedback"
              data={screeningData}
              colors={["#3B82F6", "#60A5FA", "#10B981", "#F87171"]}
            />
          </div>
          <div className="animate-fadeIn delay-200 bg-gray-800/40 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 shadow-md">
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
          <p className="text-gray-500 text-center mt-6">No data found for selected filters.</p>
        )
      )}
    </div>
  )
}
