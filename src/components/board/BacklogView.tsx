import React from 'react';
import styles from './BacklogView.module.css';
import { useAppContext } from '../../context/AppContext';
import type { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { mockUsers } from '../../services/userService';

interface BacklogViewProps {
  onTaskClick: (task: Task) => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({ onTaskClick }) => {
  const { tasks, activeProjectId, searchQuery } = useAppContext();

  const projectTasks = tasks.filter(t => 
    t.projectId === activeProjectId &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getUserName = (id?: string) => {
    if (!id) return 'Unassigned';
    return mockUsers.find(u => u.id === id)?.name || id;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Danh sách Hệ thống (Backlog)</h2>
        <p className={styles.subtitle}>Tất cả công việc trong khuôn khổ dự án hiện tại</p>
      </div>
      
      {projectTasks.length === 0 ? (
        <div style={{color: 'var(--text-secondary)', padding: '20px 0'}}>
          Không tìm thấy công việc nào phù hợp.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Người phụ trách</th>
            </tr>
          </thead>
          <tbody>
            {projectTasks.map(task => (
              <tr key={task.id} onClick={() => onTaskClick(task)}>
                <td className={styles.taskId}>{task.id}</td>
                <td className={styles.taskTitle}>{task.title}</td>
                <td><Badge label={task.type} variant="blue" /></td>
                <td>
                  <Badge 
                    label={task.status} 
                    variant={task.status === 'DONE' ? 'green' : task.status === 'IN_PROGRESS' ? 'blue' : 'gray'} 
                  />
                </td>
                <td style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  {getUserName(task.assigneeId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
