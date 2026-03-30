import React, { useState } from 'react';
import styles from '../ui/Modal.module.css';
import { X, Calendar, Flag } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TaskType, TaskPriority } from '../../types';
import { mockUsers } from '../../services/userService';
import { useAppContext } from '../../context/AppContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { activeProjectId, addTask, projects } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('TASK');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [assigneeId, setAssigneeId] = useState('');

  if (!isOpen) return null;

  const activeProject = projects.find(p => p.id === activeProjectId);
  const projectMembers = mockUsers.filter(u => activeProject?.memberIds.includes(u.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProjectId) return;
    
    addTask({
      title,
      description,
      status: 'TODO',
      type,
      priority,
      startDate: new Date(startDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      assigneeId: assigneeId || undefined,
      reporterId: 'u-1',
      projectId: activeProjectId
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('TASK');
    setPriority('MEDIUM');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setAssigneeId('');
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={handleSubmit} style={{maxWidth: '600px'}}>
        <div className={styles.header}>
          <h2>Tạo Công Việc Mới</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.field}>
            <label>Tiêu đề *</label>
            <Input 
              autoFocus
              placeholder="Nhập tên công việc..." 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className={styles.field}>
            <label>Mô tả</label>
            <textarea 
              className={`${styles.select} ${styles.textarea}`}
              placeholder="Mô tả công việc..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles.field}>
              <label>Loại & Độ ưu tiên</label>
              <div style={{display: 'flex', gap: '8px'}}>
                <select className={styles.select} value={type} onChange={e => setType(e.target.value as TaskType)}>
                  <option value="TASK">Task</option>
                  <option value="STORY">Story</option>
                  <option value="BUG">Bug</option>
                  <option value="EPIC">Epic</option>
                </select>
                <select className={styles.select} value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Người phụ trách</label>
              <select className={styles.select} value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                <option value="">-- Chưa gán --</option>
                {projectMembers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles.field}>
              <label><Calendar size={14} /> Ngày bắt đầu</label>
              <input type="date" className={styles.select} value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label><Flag size={14} /> Hạn chót</label>
              <input type="date" className={styles.select} value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary">Tạo công việc</Button>
        </div>
      </form>
    </div>
  );
};
