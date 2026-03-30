import React from 'react';
import styles from './TaskCard.module.css';
import type { Task, TaskPriority } from '../../types';
import { Badge } from '../ui/Badge';
import { mockUsers } from '../../services/userService';
import { Avatar } from '../ui/Avatar';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const assignee = mockUsers.find(u => u.id === task.assigneeId);

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

  return (
    <div className={styles.card} onClick={() => onClick(task)}>
      <div className={styles.header}>
        <div className={styles.left}>
          {renderPriorityIcon(task.priority)}
          <span className={styles.id}>{task.id}</span>
        </div>
        <Badge label={task.type} variant={getBadgeVariant(task.type)} />
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <div className={styles.footer}>
        <div className={styles.date}>
          {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className={styles.assignee}>
          {assignee && <Avatar name={assignee.name} size="sm" />}
        </div>
      </div>
    </div>
  );
};
