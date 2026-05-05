import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, ShieldCheck, Laptop, Clock, LogOut, History, ShieldAlert } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { IncidentLogs } from './IncidentLogs';
import { Card } from '../ui/Card';

export const UserDashboard: React.FC<{ username: string, onLogout: () => void }> = ({ username, onLogout }) => {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes, devicesRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/user/stats?username=${username}`),
          axios.get(`http://localhost:8080/api/user/activity?username=${username}`),
          axios.get(`http://localhost:8080/api/user/devices?username=${username}`)
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
        setDevices(devicesRes.data);
      } catch (err) {
        console.error('Error fetching user telemetry');
      }
    };
    fetchData();
  }, [username]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
              <User color="white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Identity Hub</h1>
              <p className="text-xs text-slate-500 font-mono">SECURE_PROFILE: {username.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onLogout} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all">
            <LogOut size={18} />
            Terminate Session
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Validated Sessions" value={stats?.totalLogins || 0} icon={<ShieldCheck className="text-emerald-400" />} delay={0.1} />
          <StatsCard title="Challenge Responses" value={stats?.mfaCount || 0} icon={<Clock className="text-amber-400" />} delay={0.2} />
          <StatsCard title="Authorized Devices" value={devices.length} icon={<Laptop className="text-indigo-400" />} delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Log */}
          <div className="lg:col-span-2 glass overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center gap-2">
              <History size={20} className="text-indigo-400" />
              <h3 className="text-lg font-bold">Your Security History</h3>
            </div>
            <IncidentLogs incidents={activity} />
          </div>

          {/* Trusted Devices List */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                <Laptop size={20} className="text-indigo-400" />
                Linked Devices
              </h3>
              <div className="space-y-4">
                {devices.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">No endpoints registered yet.</p>
                ) : (
                  devices.map((device, i) => (
                    <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all">
                      <div className="font-bold text-sm mb-1 truncate">{device.userAgent.split(' ')[0]} {device.userAgent.includes('Windows') ? '(Windows System)' : '(Device)'}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        ACTIVE_NODE | LAST_SEEN: {new Date(device.lastSeen).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6 bg-amber-500/5 border-amber-500/20">
              <div className="flex items-start gap-3">
                <ShieldAlert className="text-amber-400 shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-amber-200 mb-1">Privacy Notice</h4>
                  <p className="text-xs text-amber-200/60 leading-relaxed">
                    Always verify your trusted devices. If you see an unrecognized endpoint, rotate your security keys immediately.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
