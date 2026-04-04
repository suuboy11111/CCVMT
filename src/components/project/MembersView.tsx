import React, { useState } from 'react';
import styles from './MembersView.module.css';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { UserPlus, UserMinus, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { AppUser } from '../../context/AppContext';

export const MembersView: React.FC = () => {
  const { activeProjectId, projects, users, addMemberToProject, removeMemberFromProject } = useAppContext();
  const { user: currentUser } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<AppUser | null | 'not_found'>(null);
  const [isSearching, setIsSearching] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId);
  if (!activeProject) return <div className={styles.container}>Vui lòng chọn dự án...</div>;

  // users đã được lọc theo project trong context
  const currentMembers = users;

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      // Tìm user trong Firestore theo email
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const found = snapshot.docs
        .map(d => d.data() as AppUser)
        .find(u => u.email.toLowerCase() === searchEmail.trim().toLowerCase());

      if (found) {
        setSearchResult(found);
      } else {
        setSearchResult('not_found');
      }
    } catch (e) {
      console.error('Error searching user:', e);
      setSearchResult('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    await addMemberToProject(activeProject.id, userId);
    setSearchEmail('');
    setSearchResult(null);
    setIsAddModalOpen(false);
  };

  const handleRemoveMember = (userId: string) => {
    if (userId === currentUser?.uid) {
      alert('Bạn không thể tự xóa mình khỏi dự án.');
      return;
    }
    if (userId === activeProject.createdBy) {
      alert('Không thể xóa người tạo dự án.');
      return;
    }
    if (window.confirm('Bạn có chắc muốn mời thành viên này rời khỏi dự án?')) {
      removeMemberFromProject(activeProject.id, userId);
    }
  };

  const isAlreadyMember = (uid: string) => activeProject.memberIds.includes(uid);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Thành viên dự án</h2>
          <p className={styles.subtitle}>
            {currentMembers.length} thành viên đang tham gia dự án {activeProject.name}
          </p>
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
        {currentMembers.map(member => (
          <div key={member.uid} className={styles.memberCard}>
            <Avatar name={member.name} src={member.photoURL || undefined} />
            <div className={styles.info}>
              <div className={styles.name}>{member.name}</div>
              <div className={styles.role}>
                {member.uid === activeProject.createdBy ? '⚡ Project Admin' : 'Thành viên'}
              </div>
              {member.email && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {member.email}
                </div>
              )}
            </div>
            <div className={styles.actions}>
              {member.uid !== currentUser?.uid && member.uid !== activeProject.createdBy && (
                <button
                  className={styles.kickBtn}
                  title="Xóa thành viên"
                  onClick={() => handleRemoveMember(member.uid)}
                >
                  <UserMinus size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm thành viên bằng email */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay} onClick={() => { setIsAddModalOpen(false); setSearchResult(null); setSearchEmail(''); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Thêm thành viên</h3>
              <button onClick={() => { setIsAddModalOpen(false); setSearchResult(null); setSearchEmail(''); }}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>
                Nhập email của người dùng đã từng đăng nhập vào hệ thống:
              </p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  type="email"
                  placeholder="Nhập email..."
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchUser()}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 6,
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                  }}
                />
                <Button variant="primary" icon={<Search size={14} />} onClick={handleSearchUser} disabled={isSearching}>
                  {isSearching ? '...' : 'Tìm'}
                </Button>
              </div>

              {searchResult === 'not_found' && (
                <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                  Không tìm thấy người dùng này. Họ cần đăng nhập vào hệ thống trước.
                </p>
              )}

              {searchResult && searchResult !== 'not_found' && (
                <div className={styles.userPickItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={searchResult.name} src={searchResult.photoURL || undefined} size="sm" />
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{searchResult.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{searchResult.email}</div>
                    </div>
                  </div>
                  {isAlreadyMember(searchResult.uid) ? (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Đã là thành viên</span>
                  ) : (
                    <Button variant="primary" onClick={() => handleAddMember(searchResult.uid)}>Thêm</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
