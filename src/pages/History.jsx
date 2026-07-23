import React, { useState } from 'react';
import Card from '../components/Card';
import { useDetection } from '../context/DetectionContext';
import { History as HistoryIcon, Search, Eye, Filter, Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import Modal from '../components/Modal';

const History = () => {
  const { history } = useDetection();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(search.toLowerCase());
    if (filter === 'ai') return matchesSearch && item.result === 'AI Generated Content';
    if (filter === 'real') return matchesSearch && item.result === 'Real Content';
    if (filter === 'image') return matchesSearch && item.media_type === 'image';
    if (filter === 'video') return matchesSearch && item.media_type === 'video';
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <HistoryIcon className="text-[var(--accent-cyan)]" size={32} />
          Detection Audit History
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Complete archive of processed images & videos with neural confidence ratings.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'ai', 'real', 'image', 'video'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filter === tab
                  ? 'btn-gradient shadow-none'
                  : 'glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <Card>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <HistoryIcon size={48} className="mx-auto text-[var(--text-muted)] opacity-50" />
            <p className="text-base font-semibold text-[var(--text-secondary)]">No matching detection records found</p>
            <p className="text-xs text-[var(--text-muted)]">Try adjusting your search query or run a new media scan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-[var(--text-muted)] text-xs">
                  <th className="py-3 px-4">Media</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Scan Verdict</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden glass-card flex items-center justify-center bg-[var(--bg-secondary)]">
                        {item.media_type === 'image' ? (
                          <img src={item.file_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <video src={item.file_url} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{item.filename}</td>
                    <td className="py-3 px-4 capitalize text-[var(--text-muted)]">{item.media_type}</td>
                    <td className="py-3 px-4">
                      <span className={item.result === 'AI Generated Content' ? 'badge-ai' : 'badge-real'}>
                        {item.result === 'AI Generated Content' ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                        {item.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--accent-cyan)]">{item.ai_percent}%</td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">{item.timestamp}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(item)}
                        className="p-2 rounded-xl text-[var(--accent-cyan)] hover:bg-[rgba(0,242,254,0.1)] transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Record Modal */}
      {selectedRecord && (
        <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title={`Inspection Report: ${selectedRecord.filename}`}>
          <div className="space-y-6 text-center">
            <div className="max-h-72 overflow-hidden rounded-xl border border-[var(--glass-border)] shadow-lg mx-auto">
              {selectedRecord.media_type === 'image' ? (
                <img src={selectedRecord.file_url} alt="Media" className="max-h-72 mx-auto object-contain" />
              ) : (
                <video src={selectedRecord.file_url} controls className="max-h-72 mx-auto" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl glass-card">
                <span className="text-xs text-[var(--text-muted)] block uppercase">AI Confidence</span>
                <span className="text-3xl font-black text-red-400 mt-1">{selectedRecord.ai_percent}%</span>
              </div>
              <div className="p-4 rounded-xl glass-card">
                <span className="text-xs text-[var(--text-muted)] block uppercase">Real Confidence</span>
                <span className="text-3xl font-black text-green-400 mt-1">{selectedRecord.real_percent}%</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default History;
