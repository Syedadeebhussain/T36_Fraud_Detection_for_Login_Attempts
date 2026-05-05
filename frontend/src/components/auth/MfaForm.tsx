import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { KeyRound, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface Props {
  username: string;
  onSuccess: (data: any) => void;
}

export const MfaForm: React.FC<Props> = ({ username, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`http://localhost:8080/api/auth/verify-otp?username=${username}&otp=${code}`);
      if (res.data.status === 'SUCCESS') {
        onSuccess(res.data);
      } else {
        setError('Verification code invalid or expired.');
      }
    } catch (err) {
      setError('System verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-10 w-full max-w-md border-amber-500/20">
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <KeyRound className="text-amber-400" size={42} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Identity Verification</h2>
      <p className="text-slate-500 text-center mb-10 text-sm leading-relaxed px-4">
        Unusual behavior detected. Enter the <span className="text-amber-400 font-semibold">6-digit access code</span> sent to your secure inbox.
      </p>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-8 flex items-center gap-3 text-rose-300 text-xs text-center">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              ref={el => inputs.current[index] = el}
              type="text"
              maxLength={1}
              className="w-12 h-14 bg-slate-950 border border-white/10 rounded-xl text-center text-2xl font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button 
          disabled={loading || otp.join('').length < 6}
          className="btn-primary w-full !bg-amber-600 hover:!bg-amber-500 shadow-amber-600/20 shadow-lg flex justify-center items-center gap-2"
        >
          {loading ? 'Verifying...' : 'Validate Identity'}
          {!loading && <CheckCircle size={20} />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">
          Dev_Token: Redis.get(otp:{username})
        </p>
      </div>
    </Card>
  );
};
