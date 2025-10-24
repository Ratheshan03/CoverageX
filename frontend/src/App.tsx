import { useState } from 'react';
import { Toaster } from 'sonner';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

/**
 * Main App Component
 * Modern UI with glassmorphism effects and clean design
 */
function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback to refresh task list when new task is created
  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
          className: 'toast-custom',
        }}
      />
      {/* Hero Section */}
      <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight">
            TaskFlow
          </h1>
          <p className="text-gray-400 text-base sm:text-lg font-light">
            Organize your work, streamline your life
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="form-section">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>

            {/* List Section */}
            <div className="list-section">
              <TaskList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Banner */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Built for Fullstack SE Developer Position @ CoverageX</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <span>© 2025 TaskFlow</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 011-1h.001a1 1 0 110 2H10a1 1 0 01-1-1zm1 2a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Open Source
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
