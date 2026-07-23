import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import { useDetection } from './context/DetectionContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useDetection();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-layout">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <main className="page-container">
          <AppRoutes />
        </main>
        <Footer />
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            {toast.type === 'error' ? (
              <AlertCircle className="text-red-400" size={20} />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="text-green-400" size={20} />
            ) : (
              <Info className="text-[var(--accent-cyan)]" size={20} />
            )}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
