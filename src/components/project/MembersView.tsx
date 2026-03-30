import React, { useState } from 'react';
import styles from './MembersView.module.css';
import { mockUsers } from '../../services/userService';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { UserPlus, UserMinus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const MembersView: React.FC = () => {
  const { activeProjectId, projects, addMemberToProject, removeMemberFromProject } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId);
  if (!activeProject) return <div className={styles.container}>Vui lòng chọn dự án...</div>;

  const currentMembers = mockUsers.filter(u => activeProject.memberIds.includes(u.id));
  const availableUsers = mockUsers.filter(u => !activeProject.memberIds.includes(u.id));

  const handleAddMember = (userId: string) => {
    addMemberToProject(activeProject.id, userId);
  };

  const handleRemoveMember = (userId: string) => {
    if (userId === 'u-1') {
      alert("Không thể xóa Quản trị viên dự án.");
      return;
    }
    if (window.confirm("Bạn có chắc muốn mời thành viên này rời khỏi dự án?")) {
      removeMemberFromProject(activeProject.id, userId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Thành viên dự án</h2>
          <p className={styles.subtitle}>Danh dách nhân sự tham gia vận hành dự án {activeProject.name}</p>
        </div>
        <Button 
          icon={<UserPlus size={16} />} 
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm thành viên
        </Button>
      </div>

      <div className={styles.membersList}>
        {currentMembers.map(user => (
          <div key={user.id} className={styles.memberCard}>
            <Avatar name={user.name} />
            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.role}>
                {user.id === 'u-1' ? '⚡ Project Admin' : 'Thành viên'}
              </div>
            </div>
            <div className={styles.actions}>
              {user.id !== 'u-1' && (
                <button 
                  className={styles.kickBtn} 
                  title="Xóa thành viên"
                  onClick={() => handleRemoveMember(user.id)}
                >
                  <UserMinus size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Thêm người dùng vào dự án</h3>
              <button onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              {availableUsers.length === 0 ? (
                <p style={{color: 'var(--text-secondary)'}}>Tất cả người dùng hệ thống đã tham gia dự án này.</p>
              ) : (
                availableUsers.map(user => (
                  <div key={user.id} className={styles.userPickItem}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                       <Avatar name={user.name} size="sm" />
                       <span style={{color: 'var(--text-primary)'}}>{user.name}</span>
                    </div>
                    <Button variant="ghost" onClick={() => handleAddMember(user.id)}>Thêm</Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
