import React from 'react';
import styles from './Sidebar.module.css';
import { 
  Kanban, 
  LayoutDashboard, 
  ListTodo, 
  CalendarDays, 
  Settings,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CreateProjectModal } from '../project/CreateProjectModal';
import { ProjectSettingsModal } from '../project/ProjectSettingsModal';
import { Edit2 } from 'lucide-react';
import type { Project } from '../../types';

export const Sidebar: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId, addProject, activeView, setActiveView } = useAppContext();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const activeProject = projects.find((p: Project) => p.id === activeProjectId) || projects[0];
  return (
    <aside className={styles.sidebar}>
      {/* Brand Logo / Tên Dự Án Đang Chọn */}
      <div className={styles.brand} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className={styles.logoIcon}>
          <Kanban size={24} />
        </div>
        <div className={styles.brandText}>
          <h2 className={styles.projectName}>{activeProject?.name || 'PreProject'}</h2>
          <span className={styles.subtext}>Dự án phần mềm</span>
        </div>
        <button 
          className={styles.settingsBtn} 
          onClick={(e) => { e.stopPropagation(); setIsSettingsModalOpen(true); }}
          title="Cài đặt dự án"
        >
          <Edit2 size={14} />
        </button>
        <ChevronDown size={16} className={styles.chevron} style={{ color: 'var(--text-secondary)' }} />
      </div>

      {isDropdownOpen && (
        <div className={styles.projectDropdown}>
          {projects.map((p: Project) => (
            <div 
              key={p.id} 
              className={`${styles.projectOption} ${p.id === activeProjectId ? styles.activeOption : ''}`}
              onClick={() => { setActiveProjectId(p.id); setIsDropdownOpen(false); }}
            >
              {p.name}
            </div>
          ))}
          <div className={styles.divider}></div>
          <div className={styles.createProjectBtn} onClick={() => { setIsCreateModalOpen(true); setIsDropdownOpen(false); }}>
            <Plus size={16} /> Tạo dự án mới...
          </div>
        </div>
      )}

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(name, key) => addProject({ name, key })}
      />

      {activeProject && (
        <ProjectSettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          project={activeProject}
        />
      )}

      {/* Menu Các Chức Năng Chính */}
      <nav className={styles.navGroup}>
        <div className={styles.navLabel}>KHÔNG GIAN LÀM VIỆC</div>
        
        <div 
          className={`${styles.navItem} ${activeView === 'BOARD' ? styles.active : ''}`}
          onClick={() => setActiveView('BOARD')}
        >
          <LayoutDashboard size={18} />
          <span>Bảng (Kanban Board)</span>
        </div>
        
        <div 
          className={`${styles.navItem} ${activeView === 'BACKLOG' ? styles.active : ''}`}
          onClick={() => setActiveView('BACKLOG')}
        >
          <ListTodo size={18} />
          <span>Danh sách (Backlog)</span>
        </div>
        
        <div 
          className={`${styles.navItem} ${activeView === 'TIMELINE' ? styles.active : ''}`}
          onClick={() => setActiveView('TIMELINE')}
        >
          <CalendarDays size={18} />
          <span>Lịch trình (Timeline)</span>
        </div>
      </nav>

      <div className={styles.spacer} />

      {/* User và Cài đặt */}
      <nav className={styles.navGroup}>
        <div 
          className={`${styles.navItem} ${activeView === 'MEMBERS' ? styles.active : ''}`}
          onClick={() => setActiveView('MEMBERS')}
        >
          <Settings size={18} />
          <span>Thành viên dự án</span>
        </div>
      </nav>

      {/* User Profile */}
      <div className={styles.userProfile}>
        <div className={styles.userAvatar}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.displayName}</span>
          <button className={styles.logoutBtn} onClick={logout}>Đăng xuất</button>
        </div>
      </div>
    </aside>
  );
};
