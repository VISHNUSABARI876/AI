import React, { useState } from 'react';
import Card from '../components/Card';
import { Settings as SettingsIcon, Moon, Sun, Sliders, Shield, Save, Key, Cpu } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { useDetection } from '../context/DetectionContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useDetection();
  
  const [threshold, setThreshold] = useState(50);
  const [maxFrames, setMaxFrames] = useState(30);
  const [modelType, setModelType] = useState('ViT-B/32');
  const [apiKey, setApiKey] = useState('dv_live_984f1a29e84102c77');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <SettingsIcon className="text-[var(--accent-cyan)]" size={32} />
          System Settings & Preferences
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Configure model parameters, theme appearance, and API integration options.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Settings */}
        <Card title="Appearance Theme" icon={theme === 'dark' ? Moon : Sun}>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Interface Theme Mode</p>
              <p className="text-xs text-[var(--text-muted)]">Currently active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary text-xs"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
              Switch Theme
            </button>
          </div>
        </Card>

        {/* Model Threshold Parameters */}
        <Card title="Detection Sensitivity Parameters" icon={Sliders}>
          <div className="space-y-6 py-2">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-[var(--text-primary)]">AI Classification Threshold</span>
                <span className="text-[var(--accent-cyan)] font-mono">{threshold}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-cyan)]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Media with an AI probability score at or above this cutoff will be flagged as "AI Generated Content".
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Max Video Frames to Sample
              </label>
              <select
                value={maxFrames}
                onChange={(e) => setMaxFrames(Number(e.target.value))}
                className="w-full p-3 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              >
                <option value={10}>10 Frames (Fastest Speed)</option>
                <option value={20}>20 Frames (Balanced)</option>
                <option value={30}>30 Frames (Recommended Standard)</option>
                <option value={60}>60 Frames (High Precision Scan)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Model Architecture */}
        <Card title="Neural Backbone Architecture" icon={Cpu}>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Active CLIP Model Weights
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full p-3 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              >
                <option value="ViT-B/32">ViT-B/32 (Vision Transformer Base)</option>
                <option value="ViT-B/16">ViT-B/16 (Higher Granularity Patching)</option>
                <option value="RN50">ResNet-50 (Convolutional Neural Network)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                API Authorization Key
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-card text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-cyan)]"
                />
              </div>
            </div>
          </div>
        </Card>

        <button type="submit" className="w-full btn-gradient py-3.5 text-base">
          <Save size={20} /> Save Preferences
        </button>
      </form>
    </div>
  );
};

export default Settings;
