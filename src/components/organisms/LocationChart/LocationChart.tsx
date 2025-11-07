'use client';

import { memo, useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import styles from './LocationChart.module.css';

export type LocationCount = {
  location: string;
  count: number;
};

export type LocationChartProps = {
  data: LocationCount[];
};

type ChartDataItem = {
  name: string;
  value: number;
};

const CHART_COLOR_VARS = [
  '--chart-blue',
  '--chart-teal',
  '--chart-amber',
  '--chart-orange',
  '--chart-indigo',
  '--chart-emerald',
  '--chart-yellow',
  '--chart-pink',
  '--chart-purple',
  '--chart-sky',
] as const;

const getChartColors = (): string[] => {
  if (typeof window === 'undefined') return [];

  const root = document.documentElement;
  return CHART_COLOR_VARS.map((varName) =>
    getComputedStyle(root).getPropertyValue(varName).trim()
  );
};

const renderLabel = (props: PieLabelRenderProps): string => {
  const { name, percent } = props;
  if (typeof name === 'string' && typeof percent === 'number') {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  }
  return '';
};

const LocationChartComponent = ({ data }: LocationChartProps) => {
  const chartData = useMemo<ChartDataItem[]>(
    () =>
      data.map((item) => ({
        name: item.location,
        value: item.count,
      })),
    [data]
  );

  const colors = useMemo(() => getChartColors(), []);

  if (chartData.length === 0 || colors.length === 0) return null;

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} characters`, 'Count']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
            }}
          />
          <Legend
            wrapperStyle={{
              color: 'var(--color-text-primary)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LocationChart = memo(LocationChartComponent);