import React, { useState, useEffect } from 'react';
import styles from '../ui/Modal.module.css';
import { X, Trash2, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppContext } from '../../context/AppContext';
import type { Project } from '../../types';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ isOpen, onClose, project }) => {
  const { updateProject, deleteProject } = useAppContext();
  const [name, setName] = useState(project.name);
  const [key, setKey] = useState(project.key);

  useEffect(() => {
    setName(project.name);
    setKey(project.key);
  }, [project]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, { name, key });
    onClose();
  };

  const handleDelete = () => {
    const confirmText = `Bạn có chắc chắn muốn xóa vĩnh viễn dự án "${project.name}" không? Toàn bộ task sẽ bị mất.`;
    if (window.confirm(confirmText)) {
      deleteProject(project.id);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={handleSave}>
        <div className={styles.header}>
          <h2>Cài đặt Dự án</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.field}>
            <label>Tên dự án</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>Mã Dự Án (Key)</label>
            <Input value={key} onChange={e => setKey(e.target.value.toUpperCase())} required />
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'rgba(226, 117, 117, 0.05)', borderRadius: 8, border: '1px solid rgba(226, 117, 117, 0.2)' }}>
            <h4 style={{ color: 'var(--accent-red)', marginBottom: 8 }}>Vùng nguy hiểm</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>Xóa dự án sẽ gỡ bỏ toàn bộ dữ liệu công việc liên quan. Hành động này không thể hoàn tác.</p>
            <Button type="button" variant="ghost" onClick={handleDelete} style={{ color: 'var(--accent-red)' }}>
                <Trash2 size={16} /> Xóa dự án này
            </Button>
          </div>
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary" icon={<Save size={16} />}>Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
};
