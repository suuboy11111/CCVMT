import React, { useState } from 'react';
import styles from '../ui/Modal.module.css';
import { X, Calendar, Flag } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TaskType, TaskPriority } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { activeProjectId, addTask, users } = useAppContext();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('TASK');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [assigneeId, setAssigneeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Dùng users thật từ context (đã được lọc theo project)
  const projectMembers = users;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProjectId || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        description,
        status: 'TODO',
        type,
        priority,
        startDate: new Date(startDate).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        assigneeId: assigneeId || undefined,
        reporterId: user.uid, // Dùng uid của user thật
        projectId: activeProjectId,
      });
      resetForm();
      onClose();
    } catch (e) {
      console.error('Failed to create task:', e);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <form
        className={styles.modal}
        onSubmit={handleSubmit}
        style={{ maxWidth: '600px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Tạo Công Việc Mới</h2>
          <button type="button" className={styles.closeBtn} onClick={handleClose}>
            <X size={20} />
          </button>
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
              <div style={{ display: 'flex', gap: '8px' }}>
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
                  <option key={u.uid} value={u.uid}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles.field}>
              <label><Calendar size={14} /> Ngày bắt đầu</label>
              <input
                type="date"
                className={styles.select}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label><Flag size={14} /> Hạn chót</label>
              <input
                type="date"
                className={styles.select}
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
          </Button>
        </div>
      </form>
    </div>
  );
};
