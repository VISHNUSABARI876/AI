import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { Shield, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDetection } from '../context/DetectionContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showToast } = useDetection();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    login(email, password);
    showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-4 shadow-[var(--glow-cyan)]">
            <Shield className="text-black" size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Welcome Back</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Sign in to access your GodsEye AI account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                placeholder="analyst@godseye.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-gradient py-3.5 text-base mt-2">
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--accent-cyan)] font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
