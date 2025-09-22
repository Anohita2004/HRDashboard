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
  return (
    <g>
      {data.map((d, i) => {
        const index = data.findIndex((entry) => entry.name === d.name);
        return (
          <motion.text
            key={`${d.name}-${d.value}`} // ensures remount and animation reset
            x={cx}
            y={cy + i * 18 - data.length * 9}
            fill={colors[index % colors.length]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fontWeight="500"
            initial={{ opacity: 0, y: cy + 40 }}
            animate={{
              opacity: 1,
              y: cy + i * 18 - data.length * 9,
            }}
            transition={{
              duration: 0.6,
              delay: 0.5 + i * 0.2,
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

  const zeroValues = chartData.filter((d) => d.value === 0);
  const nonZeroValues = chartData.filter((d) => d.value !== 0);

  return (
    <div className="relative bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-700">
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

        
          <Tooltip />

          {/* Legend only for non-zero values */}
          <Legend
            verticalAlign="bottom"
            align="center"
            payload={nonZeroValues.map((item, index) => ({
              id: item.name,
              type: "square",
              value: `${item.name}: ${item.value}`,
              color: COLORS[index % COLORS.length],
            }))}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Zero-value legends table */}
      {zeroValues.length > 0 && (
        <motion.div
          className="absolute top-6 right-6 bg-gray-900/80 p-3 rounded-md shadow-lg border border-gray-700"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h3 className="text-xs font-semibold text-gray-300 mb-2">
            Zero Value Legends
          </h3>
          <table className="text-xs text-gray-300">
            <tbody>
              {zeroValues.map((item, i) => (
                <tr key={item.name}>
                  <td>
                    <span
                      className="inline-block w-3 h-3 rounded-sm mr-2"
                      style={{
                        backgroundColor:
                          COLORS[
                            chartData.findIndex((d) => d.name === item.name) %
                              COLORS.length
                          ],
                      }}
                    ></span>
                  </td>
                  <td>{item.name}</td>
                  <td className="pl-2 text-gray-400">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

