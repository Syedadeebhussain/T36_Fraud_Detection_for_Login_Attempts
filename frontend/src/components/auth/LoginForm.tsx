import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, User, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { RiskGauge } from '../ui/RiskGauge';

interface Props {
  onSuccess: (data: any) => void;
  onMfaRequired: (username: string) => void;
}

export const LoginForm: React.FC<Props> = ({ onSuccess, onMfaRequired }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [riskData, setRiskData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase('analyzing');
    setError(null);

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      const data = res.data;
      setRiskData(data);

      // Artificially wait for "analysis" feeling
      await new Promise(r => setTimeout(r, 1500));
      setPhase('complete');
      await new Promise(r => setTimeout(r, 800));

      if (data.status === 'SUCCESS') {
        onSuccess(data);
      } else if (data.status === 'MFA_REQUIRED') {
        onMfaRequired(username);
      } else if (data.status === 'BLOCKED') {
        setError('Security Block: ' + (data.reasons || []).join(', '));
        setPhase('idle');
      } else {
        setError('Invalid credentials');
        setPhase('idle');
      }
    } catch (err) {
      setError('Connection failure. Intelligence systems offline.');
      setPhase('idle');
    }
  };

  return (
    <Card className="p-10 w-full max-w-md overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'idle' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
                <Shield className="text-indigo-400" size={42} />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Access Gateway</h2>
            <p className="text-slate-500 text-center mb-10 text-sm">Adaptive Security Protocol Enabled</p>

            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-8 flex items-center gap-3 text-rose-300 text-sm"
              >
                <AlertTriangle size={18} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Terminal Username"
                  className="input-field pl-12"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Security Key"
                  className="input-field pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full shadow-lg shadow-indigo-600/20">
                Authenticate
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-slate-600 font-mono italic">
              DEMO_MODE: admin / password123
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <RiskGauge value={riskData?.riskScore || 0} size={180} strokeWidth={12} />
            
            <div className="mt-10 space-y-4 w-full text-center">
              <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                {phase === 'analyzing' ? (
                  <>
                    <Loader2 className="animate-spin text-indigo-400" size={20} />
                    Calculating Risk...
                  </>
                ) : (
                  <>Analysis Complete</>
                )}
              </h3>
              
              <div className="space-y-2 max-h-32 overflow-y-auto px-4">
                {riskData?.reasons?.map((reason: string, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="text-xs text-slate-400 font-mono py-1 border-b border-white/5 last:border-0"
                  >
                    🔍 {reason}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
