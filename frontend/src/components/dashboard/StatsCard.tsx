import React from 'react';
import { Card } from '../ui/Card';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  delay?: number;
}

export const StatsCard: React.FC<Props> = ({ title, value, icon, trend, delay }) => {
  return (
    <Card className="p-6 relative group overflow-hidden" delay={delay}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {React.cloneElement(icon as React.ReactElement, { size: 64 })}
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-indigo-500/20 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-lg uppercase tracking-tighter">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
      </div>
    </Card>
  );
};
