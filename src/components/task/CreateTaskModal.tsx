import React, { useState } from 'react';
import styles from '../ui/Modal.module.css';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TaskType } from '../../types';
import { mockUsers } from '../../services/userService';
import { useAppContext } from '../../context/AppContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { activeProjectId, addTask } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('TASK');
  const [assigneeId, setAssigneeId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProjectId) return;
    
    addTask({
      title,
      description,
      status: 'TODO',
      type,
      assigneeId: assigneeId || undefined,
      reporterId: 'u-1', // Tạm thời hardcode reporter
      projectId: activeProjectId
    });
    
    setTitle('');
    setDescription('');
    setType('TASK');
    setAssigneeId('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>Tạo Công Việc</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.field}>
            <label>Tiêu đề *</label>
            <Input 
              autoFocus
              placeholder="VD: Cập nhật giao diện..." 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className={styles.field}>
            <label>Mô tả chi tiết</label>
            <textarea 
              className={`${styles.select} ${styles.textarea}`}
              placeholder="Nhập yêu cầu chi tiết..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles.field}>
              <label>Loại (Task Type)</label>
              <select className={styles.select} value={type} onChange={e => setType(e.target.value as TaskType)}>
                <option value="TASK">Task (Công việc)</option>
                <option value="STORY">Story</option>
                <option value="BUG">Bug (Lỗi)</option>
                <option value="EPIC">Epic</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Người phụ trách</label>
              <select className={styles.select} value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                <option value="">-- Chưa theo dõi --</option>
                {mockUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary">Tạo Task</Button>
        </div>
      </form>
    </div>
  );
};
