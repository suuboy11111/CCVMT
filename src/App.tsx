import React, { useState } from 'react';
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
    <div className="app-container">
      <HeaderFilter />
      <main>
        <KanbanBoard onTaskClick={handleTaskClick} />
      </main>
      
      <TaskSidePanel 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleClosePanel}
      />
    </div>
  );
}

export default App;
