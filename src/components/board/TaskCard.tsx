import React from 'react';
import styles from './TaskCard.module.css';
import type { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { mockUsers } from '../../services/userService';
import { Avatar } from '../ui/Avatar';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const assignee = mockUsers.find(u => u.id === task.assigneeId);

  const getBadgeVariant = (type: string) => {
    switch(type) {
      case 'BUG': return 'red';
      case 'STORY': return 'green';
      case 'EPIC': return 'purple';
      default: return 'blue';
    }
  };

  return (
    <div className={styles.card} onClick={() => onClick(task)}>
      <div className={styles.header}>
        <span className={styles.id}>{task.id}</span>
        <Badge label={task.type} variant={getBadgeVariant(task.type)} />
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <div className={styles.footer}>
        <div className={styles.assignee}>
          {assignee && <Avatar name={assignee.name} size="sm" />}
        </div>
      </div>
    </div>
  );
};
