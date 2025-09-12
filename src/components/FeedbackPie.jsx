import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = [
  "#4F46E5", // Indigo
  "#16A34A", // Green
  "#DC2626", // Red
  "#F59E0B", // Amber
  "#0EA5E9", // Sky
  "#9333EA", // Purple
]

export default function FeedbackPie({ title, data }) {
  // Convert to array format
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }))

  // Filter only non-zero values for the pie
  const nonZeroData = chartData.filter((d) => d.value > 0)

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={nonZeroData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {nonZeroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />

          {/* Custom legend that always includes 0 values */}
          <Legend
            payload={chartData.map((item, index) => ({
              id: item.name,
              type: "square",
              value: `${item.name}: ${item.value}`,
              color: COLORS[index % COLORS.length],
            }))}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
