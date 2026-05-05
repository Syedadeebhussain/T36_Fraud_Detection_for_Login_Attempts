import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  data: any;
}

export const RiskChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Safe', value: data?.SUCCESS || 0, color: '#10b981' },
    { name: 'MFA', value: data?.MFA_REQUIRED || 0, color: '#fbbf24' },
    { name: 'Blocked', value: data?.BLOCKED || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-600 text-sm italic">
        Awaiting telemetry data...
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#94a3b8' }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
