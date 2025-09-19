import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#4F46E5", // Indigo
  "#16A34A", // Green
  "#DC2626", // Red
  "#F59E0B", // Amber
  "#0EA5E9", // Sky
  "#9333EA", // Purple
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
  name,
  index,
  colors,
}) => {
  const RADIAN = Math.PI / 180;
  if (value === 0) return null;

  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={colors[index % colors.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${name}: ${value}`}
    </text>
  );
};

const CenterLabels = ({ data, cx, cy, colors }) => {
  const zeroSlices = data.filter((d) => d.value === 0);

  return (
    <g>
      {zeroSlices.map((d, i) => {
        const index = data.findIndex((entry) => entry.name === d.name);

        return (
          <motion.text
            key={d.name}
            x={cx}
            y={cy + i * 1 - zeroSlices.length * 9}
            fill={colors[index % colors.length]} // 🔹 Use slice color
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fontWeight="500"
            initial={{ opacity: 0, y: cy + 40 }}
            animate={{
              opacity: 1,
              y: cy + i * 18 - zeroSlices.length * 9,
            }}
            transition={{
              duration: 0.6,
              delay: 1 + i * 0.2,
              type: "spring",
              stiffness: 120,
            }}
          >
            {`${d.name}: 0`}
          </motion.text>
        );
      })}
    </g>
  );
};

export default function FeedbackPie({ title, data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

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

          {/* Now center labels get relative cx, cy from "50%" */}
          <CenterLabels data={chartData} cx={435} cy={65} colors={COLORS}  />

          <Tooltip />
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
  );
}