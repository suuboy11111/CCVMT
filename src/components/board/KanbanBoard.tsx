import React from 'react';
import styles from './KanbanBoard.module.css';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { useAppContext } from '../../context/AppContext';

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
  const { tasks, activeProjectId, updateTaskStatus, searchQuery } = useAppContext();

  // Lọc task theo project đang chọn VÀ theo nội dung tìm kiếm
  const projectTasks = tasks.filter(t => 
    t.projectId === activeProjectId &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!activeProjectId) {
    return <div className={styles.loading}>Vui lòng chọn hoặc tạo dự án mới...</div>;
  }

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
                {projectTasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            <div className={styles.columnBody}>
              {projectTasks.filter(t => t.status === col.id).map(task => (
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
