import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { MfaForm } from './components/auth/MfaForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [mfaUsername, setMfaUsername] = useState<string | null>(null);

  const handleLoginSuccess = (data: any) => {
    setUser(data);
    setMfaUsername(null);
  };

  const handleMfaRequired = (username: string) => {
    setMfaUsername(username);
  };

  const handleLogout = () => {
    setUser(null);
    setMfaUsername(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div 
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            
            <LoginForm 
              onSuccess={handleLoginSuccess} 
              onMfaRequired={() => {}} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {user.role === 'ROLE_ADMIN' ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <UserDashboard username={user.username} onLogout={handleLogout} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-8 text-center text-[10px] text-slate-700 uppercase tracking-[0.3em] font-mono border-t border-white/5 bg-slate-950">
        &copy; 2026 Antigravity Security Systems | Protocol_v2.0.4 | All Rights Reserved
      </footer>
    </div>
  );
}

export default App;
