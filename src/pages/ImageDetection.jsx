import React, { useState } from 'react';
import Card from '../components/Card';
import { Image as ImageIcon, Upload, Sparkles, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { analyzeMedia } from '../services/api';
import { useDetection } from '../context/DetectionContext';
import { ScannerLoader } from '../components/Loader';

const ImageDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const { addDetectionRecord, showToast } = useDetection();

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    } else {
      showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setProgress(20);

    try {
      const response = await analyzeMedia(file, (p) => setProgress(Math.max(20, Math.min(90, p))));
      setProgress(100);
      setTimeout(() => {
        setResult(response.data);
        addDetectionRecord(response.data);
        showToast('Image scan completed!', 'success');
        setLoading(false);
      }, 400);
    } catch (err) {
      console.error('Image analysis error', err);
      showToast('Failed to analyze image.', 'error');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-3">
          <ImageIcon className="text-[var(--accent-cyan)]" size={32} />
          AI Image Detection Sandbox
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Deep visual inspection powered by OpenAI CLIP zero-shot neural transformers.
        </p>
      </div>

      <Card>
        {loading ? (
          <ScannerLoader progress={progress} statusText="Evaluating pixel distribution & neural feature embeddings..." />
        ) : result ? (
          <div className="space-y-6 text-center">
            <div className="relative max-w-md mx-auto overflow-hidden rounded-2xl border border-[var(--glass-border)] shadow-xl">
              <img src={result.file_url} alt="Analyzed" className="w-full h-auto object-cover" />
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-4 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2">
                <span className={result.result === 'AI Generated Content' ? 'badge-ai text-base py-1.5 px-4' : 'badge-real text-base py-1.5 px-4'}>
                  {result.result === 'AI Generated Content' ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                  {result.result}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-red-500/30">
                  <p className="text-xs text-[var(--text-muted)] uppercase font-semibold">AI Probability</p>
                  <p className="text-3xl font-black text-red-400 mt-1">{result.ai_percent}%</p>
                </div>
                <div className="p-4 rounded-xl bg-[rgba(34,197,94,0.1)] border border-green-500/30">
                  <p className="text-xs text-[var(--text-muted)] uppercase font-semibold">Authentic Real</p>
                  <p className="text-3xl font-black text-green-400 mt-1">{result.real_percent}%</p>
                </div>
              </div>
            </div>

            <button onClick={handleReset} className="btn-secondary">
              <RefreshCw size={18} /> Scan Another Image
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              className="border-2 border-dashed border-[var(--glass-border-hover)] rounded-2xl p-10 text-center bg-[rgba(0,0,0,0.2)] hover:border-[var(--accent-cyan)] transition-colors cursor-pointer relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Selected Preview" className="max-h-64 mx-auto rounded-xl border border-[var(--glass-border)]" />
                  <p className="text-sm font-semibold text-[var(--accent-cyan)]">{file.name}</p>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-16 h-16 rounded-full bg-[rgba(0,242,254,0.1)] text-[var(--accent-cyan)] flex items-center justify-center mx-auto">
                    <Upload size={32} />
                  </div>
                  <p className="text-base font-bold text-[var(--text-primary)]">Drop your image here or click to browse</p>
                  <p className="text-xs text-[var(--text-muted)]">Supports JPG, PNG, WEBP formats up to 20MB</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!file}
              className="w-full btn-gradient py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={20} /> Run AI Image Scanner
            </button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ImageDetection;
