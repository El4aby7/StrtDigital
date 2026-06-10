import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { colors, chartPalette } from "../../theme/tokens";

interface StageBarChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

export function StageBarChart({ data, height = 280 }: StageBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.line} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: colors.muted }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: colors.muted }} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "rgba(20,184,196,0.06)" }}
          contentStyle={{
            borderRadius: 12,
            border: `1px solid ${colors.line}`,
            boxShadow: "0 8px 24px rgba(13,27,42,0.10)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
          {data.map((_, i) => (
            <Cell key={i} fill={chartPalette[i % chartPalette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
