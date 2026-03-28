import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderFilter } from './components/layout/HeaderFilter';
import { KanbanBoard } from './components/board/KanbanBoard';
import { TaskSidePanel } from './components/task/TaskSidePanel';
import type { Task } from './types';
import './index.css';

function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleClosePanel = () => {
    setSelectedTask(null);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <HeaderFilter />
        <main>
          <KanbanBoard onTaskClick={handleTaskClick} />
        </main>
      </div>
      
      <TaskSidePanel 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleClosePanel}
      />
    </div>
  );
}

export default App;
