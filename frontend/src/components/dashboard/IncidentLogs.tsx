import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Clock, ChevronDown, ChevronUp, MapPin, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  incidents: any[];
}

export const IncidentLogs: React.FC<Props> = ({ incidents }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SUCCESS': return { icon: <ShieldCheck size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      case 'BLOCKED': return { icon: <ShieldAlert size={18} />, color: 'text-rose-400', bg: 'bg-rose-400/10' };
      case 'MFA_REQUIRED': return { icon: <Shield size={18} />, color: 'text-amber-400', bg: 'bg-amber-400/10' };
      default: return { icon: <Shield size={18} />, color: 'text-slate-400', bg: 'bg-slate-400/10' };
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { label: 'Low', color: 'text-emerald-400' };
    if (score < 70) return { label: 'Medium', color: 'text-amber-400' };
    return { label: 'Critical', color: 'text-rose-400' };
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 p-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-b border-white/5">
        <div className="col-span-2">User / Identity</div>
        <div>Security Score</div>
        <div className="col-span-2">Telemetry Status</div>
        <div>Time</div>
      </div>
      
      <div className="divide-y divide-white/5">
        {incidents.map((inc, i) => {
          const config = getStatusConfig(inc.status);
          const risk = getRiskLevel(inc.riskScore);
          const isExpanded = expandedId === i;

          return (
            <div key={i} className="group transition-colors hover:bg-white/[0.02]">
              <div 
                className="grid grid-cols-6 p-4 items-center cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : i)}
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{inc.username}</div>
                    <div className="text-[10px] font-mono text-slate-500">{inc.ipAddress}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`text-lg font-bold font-mono ${risk.color}`}>{inc.riskScore}</div>
                  <div className={`text-[10px] uppercase font-bold ${risk.color} opacity-60`}>{risk.label}</div>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${config.bg} ${config.color}`}>
                    {inc.status}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-[150px]">
                    {inc.city}, {inc.country}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-mono">
                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-950/30"
                  >
                    <div className="p-6 grid grid-cols-3 gap-8 border-t border-white/5">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <MapPin size={14} /> Location Intelligence
                        </div>
                        <div className="text-sm space-y-1">
                          <p><span className="text-slate-500">City:</span> {inc.city}</p>
                          <p><span className="text-slate-500">Country:</span> {inc.country}</p>
                          <p><span className="text-slate-500">Coordinates:</span> {inc.latitude}, {inc.longitude}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <Monitor size={14} /> Device Fingerprint
                        </div>
                        <div className="text-xs font-mono bg-black/20 p-2 rounded border border-white/5 text-slate-400 leading-relaxed">
                          {inc.userAgent}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <ShieldAlert size={14} /> Risk Breakdown
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {inc.riskReasons?.split(',').map((reason: string, ridx: number) => (
                            <span key={ridx} className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-slate-400">
                              {reason.trim()}
                            </span>
                          )) || <span className="text-xs italic text-slate-600">No anomalies detected</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
