import React from 'react';
import styles from './HeaderFilter.module.css';
import { Search, Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { mockUsers } from '../../services/userService';
import { Avatar } from '../ui/Avatar';
import { CreateTaskModal } from '../task/CreateTaskModal';
import { useAppContext } from '../../context/AppContext';

export const HeaderFilter: React.FC = () => {
  const { searchQuery, setSearchQuery } = useAppContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>Tất cả Công việc</h1>
        <div className={styles.search}>
          <Input 
            placeholder="Tìm kiếm task, epic..." 
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.right}>
        <div className={styles.users}>
          {mockUsers.map(u => (
            <Avatar key={u.id} name={u.name} />
          ))}
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setIsTaskModalOpen(true)}>Tạo Task</Button>
      </div>

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
    </header>
  );
};
