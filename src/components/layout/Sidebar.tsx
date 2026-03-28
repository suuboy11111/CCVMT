import React from 'react';
import styles from './Sidebar.module.css';
import { 
  Kanban, 
  LayoutDashboard, 
  ListTodo, 
  CalendarDays, 
  Settings 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      {/* Brand Logo / Tên Môn Học */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Kanban size={24} />
        </div>
        <div className={styles.brandText}>
          <h2 className={styles.projectName}>PreProject</h2>
          <span className={styles.subtext}>Công cụ PT Phần Mềm</span>
        </div>
      </div>

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
