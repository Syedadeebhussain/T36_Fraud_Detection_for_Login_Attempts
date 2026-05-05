import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShieldAlert, Globe, Activity, LogOut, 
  Terminal, Settings, Play, RefreshCcw, Bell
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { IncidentLogs } from './IncidentLogs';
import { ThreatMap } from './ThreatMap';
import { RiskChart } from './RiskChart';
import { Toaster, toast } from 'sonner';

export const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [stats, setStats] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'map' | 'logs' | 'settings'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, incidentsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/stats'),
        axios.get('http://localhost:8080/api/admin/incidents')
      ]);
      setStats(statsRes.data);
      setIncidents(incidentsRes.data);
    } catch (err) {
      console.error('Telemetry fetch failed');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateAttack = () => {
    setSimulating(true);
    toast.error("ALERT: Brute force simulation started", {
      description: "IP 192.168.1.105 triggering velocity check thresholds.",
    });
    
    setTimeout(() => {
      setSimulating(false);
      toast.success("Simulation complete: 5 attempts blocked.");
      fetchData();
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Sidebar Overlay */}
      <div className="fixed left-0 top-0 h-full w-20 bg-slate-900 border-r border-white/5 flex flex-col items-center py-8 gap-10 z-[60]">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 cursor-pointer" onClick={() => setActiveView('overview')}>
          <ShieldAlert color="white" size={24} />
        </div>
        <div className="flex flex-col gap-6 text-slate-500">
          <LayoutDashboard 
            className={`cursor-pointer transition-colors ${activeView === 'overview' ? 'text-indigo-400' : 'hover:text-slate-300'}`} 
            size={24} 
            onClick={() => setActiveView('overview')}
          />
          <Globe 
            className={`cursor-pointer transition-colors ${activeView === 'map' ? 'text-indigo-400' : 'hover:text-slate-300'}`} 
            size={24} 
            onClick={() => setActiveView('map')}
          />
          <Terminal 
            className={`cursor-pointer transition-colors ${activeView === 'logs' ? 'text-indigo-400' : 'hover:text-slate-300'}`} 
            size={24} 
            onClick={() => setActiveView('logs')}
          />
          <Settings 
            className={`cursor-pointer transition-colors ${activeView === 'settings' ? 'text-indigo-400' : 'hover:text-slate-300'}`} 
            size={24} 
            onClick={() => setActiveView('settings')}
          />
        </div>
        <button onClick={onLogout} className="mt-auto p-4 hover:text-rose-400 transition-colors">
          <LogOut size={24} />
        </button>
      </div>

      <main className="pl-20">
        {/* Top Navbar */}
        <nav className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Threat Intelligence Console</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Status: <span className="text-emerald-400">System Nominal</span></p>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={handleSimulateAttack}
              disabled={simulating}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {simulating ? <RefreshCcw size={16} className="animate-spin" /> : <Play size={16} />}
              Simulate Attack
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-800" />
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-14 right-0 w-80 glass p-4 shadow-2xl z-[70] border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold mb-4 flex justify-between items-center">
                  Recent Alerts
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded">3 NEW</span>
                </h4>
                <div className="space-y-3">
                  {incidents.slice(0, 3).map((inc, i) => (
                    <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/5 flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-rose-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">{inc.status}</p>
                        <p className="text-xs text-slate-300">Suspicious attempt from {inc.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300">View All Alerts</button>
              </div>
            )}
          </div>
        </nav>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {activeView === 'overview' && (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Login Volume" value={stats?.totalAttempts || 0} icon={<Activity className="text-indigo-400" />} delay={0.1} />
                <StatsCard title="Neutralized Threats" value={stats?.statusDistribution?.BLOCKED || 0} icon={<ShieldAlert className="text-rose-400" />} trend="+12% vs last 24h" delay={0.2} />
                <StatsCard title="MFA Challenges" value={stats?.statusDistribution?.MFA_REQUIRED || 0} icon={<Globe className="text-amber-400" />} delay={0.3} />
                <StatsCard title="Global Risk Index" value={Math.round(stats?.averageRiskScore || 0)} icon={<Terminal className="text-emerald-400" />} delay={0.4} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 space-y-4 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Globe size={20} className="text-indigo-400" />
                      Global Threat Propagation
                    </h3>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-4">
                      <span>LATENCY: 24ms</span>
                      <span>FEED: Real-time</span>
                    </div>
                  </div>
                  <ThreatMap />
                </div>

                <div className="glass p-6 space-y-4">
                  <h3 className="text-lg font-bold">Threat Distribution</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">System classification of incoming login traffic based on adaptive risk rules.</p>
                  <RiskChart data={stats?.statusDistribution} />
                </div>
              </div>

              <div className="glass overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Security Incident Intelligence</h3>
                </div>
                <IncidentLogs incidents={incidents} />
              </div>
            </>
          )}

          {activeView === 'map' && (
            <div className="glass p-10 h-[700px] space-y-6">
              <h3 className="text-2xl font-bold">Fullscreen Threat Matrix</h3>
              <ThreatMap />
            </div>
          )}

          {activeView === 'logs' && (
            <div className="glass overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold">Comprehensive Security Archive</h3>
                <input type="text" placeholder="Search by IP or Username..." className="bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:border-indigo-500" />
              </div>
              <IncidentLogs incidents={incidents} />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="max-w-3xl space-y-8">
              <div className="glass p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="text-indigo-400" /> Risk Threshold Configuration</h3>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <label className="font-bold">MFA Required Threshold</label>
                      <span className="text-amber-400 font-mono">31+</span>
                    </div>
                    <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <label className="font-bold">Auto-Block Threshold</label>
                      <span className="text-rose-400 font-mono">71+</span>
                    </div>
                    <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="glass p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><ShieldAlert className="text-indigo-400" /> Adaptive Rules</h3>
                <div className="space-y-4">
                  {[
                    { label: "Impossible Travel Detection", active: true },
                    { label: "Botnet IP Blacklist", active: true },
                    { label: "New Device Challenge", active: false },
                    { label: "Velocity Rate Limiting", active: true },
                  ].map((rule, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-sm font-semibold">{rule.label}</span>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${rule.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${rule.active ? 'right-1' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
