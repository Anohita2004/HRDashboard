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
  "#9333EA", // Purple,
  
]

export default function FeedbackPie({ title, data }) {
  // Convert to array format
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }))

  // Filter only non-zero values for the pie
 //const adjustedData = chartData.map(d => ({
 // ...d,
 // value: d.value === 0 ? 0.001 : d.value
//}));
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  value,
  name,
  index,
  colors
}) => {
  const RADIAN = Math.PI / 180;

  // Skip zero values → they’ll be handled in center stack
  if (value === 0) return null;

  // Position label outside slice
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={colors[index % colors.length]} // match slice color
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${name}: ${value}`}
    </text>
  );
};


const CenterLabels = ({ data, cx, cy }) => {
  const zeroSlices = data.filter((d) => d.value === 0);

  return (
    <g>
      {zeroSlices.map((d, i) => (
        <text
          key={d.name}
          x={cx}
          y={cy + i * 16 - (zeroSlices.length * 8)} // stack vertically
          fill="#33363bff" // always grey
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
        >
          {`${d.name}: 0`}
        </text>
      ))}
    </g>
  );
};


  return (
    <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-700">
      <h2 className="text-md font-semibold text-gray-200 mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
  <Pie
    data={chartData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={120}
    labelLine={false}
    label={(props) =>
      renderCustomizedLabel({ ...props, colors: COLORS })
    }
  >
    {chartData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={COLORS[index % COLORS.length]}
        opacity={entry.value === 0 ? 0.5 : 1}
      />
    ))}
  </Pie>

  {/* Center stacked labels for 0 values */}
  <CenterLabels data={chartData} cx={200} cy={200} />




  <Tooltip />

  <Legend
  payload={chartData.map((item, index) => ({
    id: item.name,
    type: "square",
    value: `${item.name}: ${item.value}`,
    color: COLORS[index % COLORS.length],
  }))}
  /*layout="vertical"
  verticalAlign="middle"
  align="left"*/
/>

</PieChart>
      </ResponsiveContainer>
    </div>
  )
}
