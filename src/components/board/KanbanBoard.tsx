import React, { useState, useEffect } from 'react';
import styles from './KanbanBoard.module.css';
import type { Task, TaskStatus } from '../../types';
import { taskService } from '../../services/taskService';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'Cần làm' },
  { id: 'IN_PROGRESS', title: 'Đang làm' },
  { id: 'REVIEW', title: 'Đợi Review' },
  { id: 'DONE', title: 'Đã xong' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService.getTasks().then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    
    try {
      await taskService.updateTaskStatus(taskId, status);
    } catch (err) {
      console.error(err);
      // Giật dữ liệu lại nếu lỗi (trong thực tế)
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className={styles.column}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
          >
            <div className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>{col.title}</h2>
              <span className={styles.count}>
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            <div className={styles.columnBody}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <TaskCard task={task} onClick={onTaskClick} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
