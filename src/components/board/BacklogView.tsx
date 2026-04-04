import React from 'react';
import styles from './BacklogView.module.css';
import { useAppContext } from '../../context/AppContext';
import type { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface BacklogViewProps {
  onTaskClick: (task: Task) => void;
}

const STATUS_LABEL: Record<string, string> = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang làm',
  REVIEW: 'Đợi Review',
  DONE: 'Đã xong',
};

const STATUS_VARIANT: Record<string, 'green' | 'blue' | 'gray' | 'red' | 'purple'> = {
  DONE: 'green',
  IN_PROGRESS: 'blue',
  REVIEW: 'purple',
  TODO: 'gray',
};

export const BacklogView: React.FC<BacklogViewProps> = ({ onTaskClick }) => {
  const { tasks, users, activeProjectId, searchQuery } = useAppContext();

  const projectTasks = tasks.filter(t =>
    t.projectId === activeProjectId &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getUserByUid = (uid?: string) => users.find(u => u.uid === uid);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Danh sách Hệ thống (Backlog)</h2>
        <p className={styles.subtitle}>Tất cả công việc trong khuôn khổ dự án hiện tại</p>
      </div>

      {projectTasks.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>
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
            {projectTasks.map(task => {
              const assignee = getUserByUid(task.assigneeId);
              return (
                <tr key={task.id} onClick={() => onTaskClick(task)}>
                  <td className={styles.taskId}>{task.id}</td>
                  <td className={styles.taskTitle}>{task.title}</td>
                  <td><Badge label={task.type} variant="blue" /></td>
                  <td>
                    <Badge
                      label={STATUS_LABEL[task.status] || task.status}
                      variant={STATUS_VARIANT[task.status] || 'gray'}
                    />
                  </td>
                  <td>
                    {assignee ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={assignee.name} src={assignee.photoURL || undefined} size="sm" />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Chưa gán
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
