import React from 'react';
import styles from './TimelineView.module.css';
import { useAppContext } from '../../context/AppContext';
import type { Task } from '../../types';

interface TimelineViewProps {
  onTaskClick: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onTaskClick }) => {
  const { tasks, activeProjectId, searchQuery } = useAppContext();

  const projectTasks = tasks.filter(t => 
    t.projectId === activeProjectId &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())))
  ).sort((a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime());

  // Tạo phạm vi 14 ngày (7 ngày trước, 7 ngày sau hôm nay)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDateRange = new Date(today);
  startDateRange.setDate(today.getDate() - 3); // Bắt đầu trước 3 ngày
  
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(startDateRange);
    d.setDate(startDateRange.getDate() + i);
    return d;
  });

  const DAY_WIDTH = 80;

  const getTaskPosition = (task: Task) => {
    if (!task.startDate || !task.dueDate) return null;
    
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.dueDate);
    
    const startDiff = (taskStart.getTime() - startDateRange.getTime()) / (1000 * 3600 * 24);
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 3600 * 24);
    
    return {
      left: startDiff * DAY_WIDTH,
      width: Math.max(duration * DAY_WIDTH, 40) // Tối thiểu 40px để có thể click
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Lịch trình dự án (Timeline)</h2>
        <p className={styles.subtitle}>Tổng hợp tất cả công việc dọc theo thời hạnt</p>
      </div>

      <div className={styles.timelineWrapper}>
        {/* Cột Tên Task */}
        <div className={styles.taskNames}>
          <div className={styles.taskNameHeader}>Tên công việc</div>
          {projectTasks.map(task => (
            <div key={task.id} className={styles.taskNameItem} onClick={() => onTaskClick(task)}>
              {task.title}
            </div>
          ))}
        </div>

        {/* Vùng Biểu đồ Gantt */}
        <div className={styles.chartArea} style={{ width: days.length * DAY_WIDTH }}>
          <div className={styles.timelineHeader}>
            {days.map(day => (
              <div 
                key={day.toISOString()} 
                className={`${styles.dayColumn} ${day.getTime() === today.getTime() ? styles.today : ''}`}
                style={{ width: DAY_WIDTH }}
              >
                <span>{day.toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                <strong>{day.getDate()}/{day.getMonth() + 1}</strong>
              </div>
            ))}
          </div>

          <div className={styles.chartGrid}>
            {projectTasks.map(task => {
              const pos = getTaskPosition(task);
              return (
                <div key={task.id} className={styles.gridRow}>
                   {pos && (
                     <div 
                        className={`${styles.taskBar} ${styles['priority' + task.priority]}`}
                        style={{ left: pos.left, width: pos.width }}
                        onClick={() => onTaskClick(task)}
                     >
                        {task.title}
                     </div>
                   )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {projectTasks.length === 0 && (
        <div className={styles.empty}>Chưa có công việc nào để hiển thị trên lịch trình.</div>
      )}
    </div>
  );
};
