import React, { useState } from 'react';
import Card from '../components/Card';
import { useDetection } from '../context/DetectionContext';
import { LayoutDashboard, AlertTriangle, ShieldCheck, Activity, Film, Eye, Download } from 'lucide-react';
import Modal from '../components/Modal';

const Dashboard = () => {
  const { stats, history } = useDetection();
  const [selectedRecord, setSelectedRecord] = useState(null);

  const aiPercentage = stats.total_scans > 0 ? Math.round((stats.ai_count / stats.total_scans) * 100) : 0;
  const realPercentage = stats.total_scans > 0 ? 100 - aiPercentage : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Real-time statistics & deep learning verification trends</p>
        </div>

        <button 
          onClick={() => alert('Exporting PDF Summary Report...')}
          className="btn-secondary text-xs"
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-l-4 border-l-[var(--accent-cyan)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Total Media Scans</p>
              <h3 className="text-3xl font-black text-[var(--text-primary)] mt-1">{stats.total_scans}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-[rgba(0,242,254,0.1)] text-[var(--accent-cyan)]">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">AI Generated Flagged</p>
              <h3 className="text-3xl font-black text-red-400 mt-1">{stats.ai_count} ({aiPercentage}%)</h3>
            </div>
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Authentic Content</p>
              <h3 className="text-3xl font-black text-green-400 mt-1">{stats.real_count} ({realPercentage}%)</h3>
            </div>
            <div className="p-3 rounded-2xl bg-green-500/10 text-green-400">
              <ShieldCheck size={24} />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-[var(--accent-purple)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Avg AI Score</p>
              <h3 className="text-3xl font-black text-[var(--accent-purple)] mt-1">{stats.avg_ai_score}%</h3>
            </div>
            <div className="p-3 rounded-2xl bg-[rgba(127,0,255,0.1)] text-[var(--accent-purple)]">
              <Film size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Detection Ratio Distribution" className="lg:col-span-1">
          <div className="space-y-6 my-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-red-400">AI Generated ({aiPercentage}%)</span>
                <span className="text-green-400">Authentic ({realPercentage}%)</span>
              </div>
              <div className="w-full h-4 bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                <div style={{ width: `${aiPercentage}%` }} className="bg-red-500 h-full transition-all duration-500" />
                <div style={{ width: `${realPercentage}%` }} className="bg-green-500 h-full transition-all duration-500" />
              </div>
            </div>

            <div className="p-4 rounded-xl glass-card space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Neural Model:</span>
                <span className="font-semibold text-[var(--accent-cyan)]">CLIP ViT-B/32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Sampling Frame Rate:</span>
                <span className="font-semibold text-[var(--text-primary)]">30 FPS Max</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Classification Cutoff:</span>
                <span className="font-semibold text-[var(--text-primary)]">50.0% AI Threshold</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Breakdown */}
        <Card title="Recent Verification Logs" className="lg:col-span-2">
          {history.length === 0 ? (
            <p className="text-center text-[var(--text-muted)] py-12 text-sm">No analysis history recorded yet. Run a scan on Home, Image or Video detection page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] text-[var(--text-muted)]">
                    <th className="pb-3 px-2">Filename</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Verdict</th>
                    <th className="pb-3 px-2">AI Score</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {history.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                      <td className="py-3 px-2 font-medium truncate max-w-[150px]">{item.filename}</td>
                      <td className="py-3 px-2 capitalize">{item.media_type}</td>
                      <td className="py-3 px-2">
                        <span className={item.result === 'AI Generated Content' ? 'badge-ai' : 'badge-real'}>
                          {item.result}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-[var(--accent-cyan)]">{item.ai_percent}%</td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 rounded-lg text-[var(--accent-cyan)] hover:bg-[rgba(0,242,254,0.1)] transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Record Modal */}
      {selectedRecord && (
        <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title={`Report: ${selectedRecord.filename}`}>
          <div className="space-y-4 text-center">
            {selectedRecord.media_type === 'image' ? (
              <img src={selectedRecord.file_url} alt="Media" className="max-h-64 mx-auto rounded-xl border border-[var(--glass-border)]" />
            ) : (
              <video src={selectedRecord.file_url} controls className="max-h-64 mx-auto rounded-xl border border-[var(--glass-border)]" />
            )}

            <div className="grid grid-cols-2 gap-4 text-sm font-semibold pt-2">
              <div className="p-3 rounded-xl glass-card">
                <span className="text-[var(--text-muted)] text-xs block">AI Probability</span>
                <span className="text-2xl text-red-400 font-bold">{selectedRecord.ai_percent}%</span>
              </div>
              <div className="p-3 rounded-xl glass-card">
                <span className="text-[var(--text-muted)] text-xs block">Real Probability</span>
                <span className="text-2xl text-green-400 font-bold">{selectedRecord.real_percent}%</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
