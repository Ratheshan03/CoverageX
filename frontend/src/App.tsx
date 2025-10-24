import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

/**
 * Main App Component
 * Two-column layout: TaskForm on left, TaskList on right
 */
function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback to refresh task list when new task is created
  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">To-Do List</h1>
        <p className="app-subtitle">Manage your tasks efficiently</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <div className="form-section">
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>

          <div className="list-section">
            <TaskList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Express</p>
      </footer>
    </div>
  );
}

export default App;
