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
import { CreateProjectModal } from '../project/CreateProjectModal';

export const Sidebar: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId, addProject } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
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
        <ChevronDown size={16} className={styles.chevron} style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
      </div>

      {isDropdownOpen && (
        <div className={styles.projectDropdown}>
          {projects.map(p => (
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

      {/* Menu Các Chức Năng Chính */}
      <nav className={styles.navGroup}>
        <div className={styles.navLabel}>KHÔNG GIAN LÀM VIỆC</div>
        
        <a href="#" className={`${styles.navItem} ${styles.active}`}>
          <LayoutDashboard size={18} />
          <span>Bảng (Kanban Board)</span>
        </a>
        
        <a href="#" className={styles.navItem}>
          <ListTodo size={18} />
          <span>Backlog (Kế hoạch rớt)</span>
        </a>
        
        <a href="#" className={styles.navItem}>
          <CalendarDays size={18} />
          <span>Lịch trình (Timeline)</span>
        </a>
      </nav>

      <div className={styles.spacer} />

      {/* Cài đặt phần mềm */}
      <nav className={styles.navGroup}>
        <a href="#" className={styles.navItem}>
          <Settings size={18} />
          <span>Cài đặt dự án</span>
        </a>
      </nav>
    </aside>
  );
};
