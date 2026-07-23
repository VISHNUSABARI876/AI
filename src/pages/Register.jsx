import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { Shield, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDetection } from '../context/DetectionContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const { showToast } = useDetection();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    register(name, email, password);
    showToast('Account registered successfully!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-4 shadow-[var(--glow-cyan)]">
            <Shield className="text-black" size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Create Account</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Get started with GodsEye media verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                placeholder="alex@godseye.ai"
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
            <UserPlus size={20} /> Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--accent-cyan)] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
