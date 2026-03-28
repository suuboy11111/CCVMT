import React, { useState } from 'react';
import styles from '../ui/Modal.module.css';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, key: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;
    onSubmit(name, key.toUpperCase());
    setName('');
    setKey('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>Tạo Dự Án Mới</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.field}>
            <label>Tên Dự Án *</label>
            <Input 
              autoFocus
              placeholder="VD: Quản lý thư viện..." 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          </div>
          
          <div className={styles.field}>
            <label>Mã Dự Án (Key) *</label>
            <Input 
              placeholder="VD: QLTV" 
              value={key} 
              onChange={e => setKey(e.target.value)} 
              maxLength={5}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mã này sẽ là tiền tố cho các thẻ Task (VD: QLTV-123). Tối đa 5 ký tự.</span>
          </div>
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary">Tạo mới</Button>
        </div>
      </form>
    </div>
  );
};
