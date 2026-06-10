import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { colors } from "../../theme/tokens";

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
}

interface TrendLineChartProps {
  data: Array<Record<string, string | number>>;
  series: TrendSeries[];
  height?: number;
}

export function TrendLineChart({ data, series, height = 280 }: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.line} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: colors.muted }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: colors.muted }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: `1px solid ${colors.line}`,
            boxShadow: "0 8px 24px rgba(13,27,42,0.10)",
            fontSize: 13,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            fill={`url(#grad-${s.key})`}
            activeDot={{ r: 5 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
