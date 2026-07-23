import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Upload, Image as ImageIcon, Video as VideoIcon, Zap } from 'lucide-react';
import Card from '../components/Card';
import { analyzeMedia } from '../services/api';
import { useDetection } from '../context/DetectionContext';
import { ScannerLoader } from '../components/Loader';

const Home = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addDetectionRecord, showToast } = useDetection();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setProgress(15);

    try {
      const result = await analyzeMedia(file, (p) => setProgress(Math.max(15, Math.min(90, p))));
      setProgress(100);
      setTimeout(() => {
        addDetectionRecord(result.data);
        showToast('Analysis completed successfully!', 'success');
        setAnalyzing(false);
        navigate('/history');
      }, 500);
    } catch (err) {
      console.error('Analysis failed', err);
      showToast('Analysis failed. Please try again.', 'error');
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="text-center py-12 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-blue-500/30 text-xs font-semibold text-blue-400 mb-6">
          <Sparkles size={15} /> Deep Learning Media Verification Engine
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-3xl mx-auto leading-tight">
          Detect AI-Generated <br />
          <span className="text-blue-500">
            Images & Videos Instantly
          </span>
        </h1>

        <p className="mt-5 text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-normal">
          Powered by OpenAI CLIP & PyTorch neural architectures. Analyze visual artifacts, synthetic textures, and frame consistency with high accuracy.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/image-detection" className="btn-gradient text-sm px-6 py-3">
            <ImageIcon size={18} /> Analyze Image
          </Link>
          <Link to="/video-detection" className="btn-secondary text-sm px-6 py-3">
            <VideoIcon size={18} /> Analyze Video
          </Link>
        </div>
      </section>

      {/* Quick Upload Sandbox */}
      <section className="max-w-3xl mx-auto">
        <Card title="Media Inspection Sandbox" icon={Upload} subtitle="Upload JPG, PNG, WEBP image or MP4 video for evaluation">
          {analyzing ? (
            <ScannerLoader progress={progress} statusText="Running OpenAI CLIP visual embedding analysis..." />
          ) : (
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[var(--glass-border-hover)] rounded-2xl p-8 text-center bg-[rgba(0,0,0,0.15)] hover:border-blue-500 transition-colors cursor-pointer relative"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                
                {previewUrl ? (
                  <div className="space-y-4">
                    {file.type.startsWith('image/') ? (
                      <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-xl border border-[var(--glass-border)]" />
                    ) : (
                      <video src={previewUrl} controls className="max-h-64 mx-auto rounded-xl border border-[var(--glass-border)]" />
                    )}
                    <p className="text-sm font-semibold text-blue-400">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-6">
                    <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[var(--text-primary)]">Drag and drop file here, or browse</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Supports JPG, PNG, WEBP, MP4, WEBM (Max 50MB)</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!file}
                className="w-full btn-gradient py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={18} /> Run AI Scan
              </button>
            </form>
          )}
        </Card>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={Zap} title="Zero-Shot Detection">
          <p className="text-sm text-[var(--text-secondary)]">
            Utilizes OpenAI CLIP Vision Transformers to calculate semantic alignment vectors between synthetic and natural features.
          </p>
        </Card>

        <Card icon={VideoIcon} title="Video Keyframe Sampling">
          <p className="text-sm text-[var(--text-secondary)]">
            OpenCV automated frame extractor samples up to 30 strategic video keyframes to detect temporal artifacts.
          </p>
        </Card>

        <Card icon={Shield} title="Real-Time Reporting">
          <p className="text-sm text-[var(--text-secondary)]">
            Instantly generates confidence scores, AI vs Real probability percentages, and keeps persistent logs.
          </p>
        </Card>
      </section>
    </div>
  );
};

export default Home;
