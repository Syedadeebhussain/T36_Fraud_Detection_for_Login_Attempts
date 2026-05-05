import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export const RiskGauge: React.FC<Props> = ({ value, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v <= 30) return '#10b981'; // Success
    if (v <= 70) return '#f59e0b'; // Warning
    return '#ef4444'; // Danger
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Risk Score</span>
      </div>
    </div>
  );
};
