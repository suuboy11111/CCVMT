import React from 'react';
import styles from './TaskSidePanel.module.css';
import type { Task } from '../../types';
import { X, MessageSquare, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface TaskSidePanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskSidePanel: React.FC<TaskSidePanelProps> = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.id}>{task.id}</span>
            <Badge label={task.type} variant="blue" />
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{task.title}</h2>
          
          <div className={styles.section}>
            <h3>Mô tả</h3>
            <p className={styles.description}>{task.description || 'Chưa có mô tả'}</p>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>Tạo lúc: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.metaItem}>
              <span>Status:</span>
              <strong>{task.status}</strong>
            </div>
          </div>

          <div className={styles.section}>
            <h3><MessageSquare size={16} /> Bình luận</h3>
            <div className={styles.emptyComments}>Chưa có bình luận nào</div>
          </div>
        </div>
      </div>
    </>
  );
};
