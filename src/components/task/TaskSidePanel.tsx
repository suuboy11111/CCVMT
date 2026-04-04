import React, { useState } from 'react';
import styles from './TaskSidePanel.module.css';
import type { Task, TaskStatus, TaskComment, TaskPriority, TaskType } from '../../types';
import { X, MessageSquare, Trash2, Send, Calendar, Flag } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface TaskSidePanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskSidePanel: React.FC<TaskSidePanelProps> = ({ task, isOpen, onClose }) => {
  const { deleteTask, addComment, updateTask, users } = useAppContext();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !task) return null;

  // Lấy danh sách members trong project này (đã được lọc trong context)
  const projectMembers = users;

  const getUserByUid = (uid: string) => users.find(u => u.uid === uid);

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleUpdate = (field: keyof Task, value: unknown) => {
    updateTask(task.id, { [field]: value });
  };

  const handlePostComment = () => {
    if (!commentText.trim() || !user) return;
    addComment(task.id, commentText);
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handlePostComment();
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.id}>{task.id}</span>
            <select
              className={styles.minimalSelect}
              value={task.type}
              onChange={e => handleUpdate('type', e.target.value as TaskType)}
            >
              <option value="TASK">TASK</option>
              <option value="STORY">STORY</option>
              <option value="BUG">BUG</option>
              <option value="EPIC">EPIC</option>
            </select>
            <button className={styles.deleteBtn} onClick={handleDelete} title="Xóa thẻ này">
              <Trash2 size={16} />
            </button>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <textarea
            className={styles.titleInput}
            value={task.title}
            onChange={e => handleUpdate('title', e.target.value)}
            rows={2}
          />

          <div className={styles.metaGrid}>
            <div className={styles.metaField}>
              <label>Trạng thái</label>
              <select
                className={styles.statusSelect}
                value={task.status}
                onChange={e => handleUpdate('status', e.target.value as TaskStatus)}
              >
                <option value="TODO">Cần làm</option>
                <option value="IN_PROGRESS">Đang làm</option>
                <option value="REVIEW">Đợi Review</option>
                <option value="DONE">Đã xong</option>
              </select>
            </div>
            <div className={styles.metaField}>
              <label>Độ ưu tiên</label>
              <select
                className={styles.statusSelect}
                value={task.priority}
                onChange={e => handleUpdate('priority', e.target.value as TaskPriority)}
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
              </select>
            </div>
            <div className={styles.metaField}>
              <label>Người phụ trách</label>
              <select
                className={styles.statusSelect}
                value={task.assigneeId || ''}
                onChange={e => handleUpdate('assigneeId', e.target.value || undefined)}
              >
                <option value="">-- Chưa gán --</option>
                {projectMembers.map(u => (
                  <option key={u.uid} value={u.uid}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaField}>
              <label><Calendar size={12} /> Bắt đầu</label>
              <input
                type="date"
                className={styles.dateInput}
                value={task.startDate?.split('T')[0] || ''}
                onChange={e => {
                  if (e.target.value) handleUpdate('startDate', new Date(e.target.value).toISOString());
                }}
              />
            </div>
            <div className={styles.metaField}>
              <label><Flag size={12} /> Hạn chót</label>
              <input
                type="date"
                className={styles.dateInput}
                value={task.dueDate?.split('T')[0] || ''}
                onChange={e => {
                  if (e.target.value) handleUpdate('dueDate', new Date(e.target.value).toISOString());
                }}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Mô tả</h3>
            <textarea
              className={styles.descriptionInput}
              placeholder="Thêm mô tả chi tiết..."
              value={task.description || ''}
              onChange={e => handleUpdate('description', e.target.value)}
            />
          </div>

          <div className={styles.section}>
            <h3><MessageSquare size={16} /> Bình luận ({task.comments?.length || 0})</h3>

            {user && (
              <div className={styles.commentForm}>
                <div className={styles.commentInputRow}>
                  <Avatar
                    name={user.displayName || 'U'}
                    src={user.photoURL || undefined}
                    size="sm"
                  />
                  <textarea
                    className={styles.commentTextarea}
                    placeholder="Viết bình luận... (Ctrl+Enter để gửi)"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div style={{ alignSelf: 'flex-end', marginTop: 8 }}>
                  <Button variant="primary" icon={<Send size={14} />} onClick={handlePostComment}>
                    Gửi
                  </Button>
                </div>
              </div>
            )}

            <div className={styles.commentList}>
              {(!task.comments || task.comments.length === 0) ? (
                <div className={styles.emptyComments}>Chưa có bình luận.</div>
              ) : (
                [...task.comments].reverse().map((cmt: TaskComment) => {
                  const author = getUserByUid(cmt.userId);
                  return (
                    <div key={cmt.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar
                            name={author?.name || 'U'}
                            src={author?.photoURL || undefined}
                            size="sm"
                          />
                          <strong>{author?.name || 'Người dùng'}</strong>
                        </div>
                        <span>{new Date(cmt.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className={styles.commentContent}>{cmt.content}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
