import React from 'react';
import styles from './TaskCard.module.css';
import type { Task, TaskPriority } from '../../types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { users } = useAppContext();
  const assignee = users.find(u => u.uid === task.assigneeId);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'BUG': return 'red';
      case 'STORY': return 'green';
      case 'EPIC': return 'purple';
      default: return 'blue';
    }
  };

  const renderPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH': return <AlertCircle size={14} color="var(--accent-red)" />;
      case 'MEDIUM': return <ChevronUp size={14} color="var(--accent-orange)" />;
      case 'LOW': return <ChevronDown size={14} color="var(--accent-blue)" />;
      default: return null;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div className={styles.card} onClick={() => onClick(task)}>
      <div className={styles.header}>
        <div className={styles.left}>
          {task.priority && renderPriorityIcon(task.priority)}
          <span className={styles.id}>{task.id}</span>
        </div>
        <Badge label={task.type} variant={getBadgeVariant(task.type)} />
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <div className={styles.footer}>
        <div className={styles.date} style={{ color: isOverdue ? 'var(--accent-red)' : undefined }}>
          {task.dueDate && new Date(task.dueDate).toLocaleDateString('vi-VN')}
        </div>
        <div className={styles.assignee}>
          {assignee && (
            <Avatar
              name={assignee.name}
              src={assignee.photoURL || undefined}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
