import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const initials = name.substring(0, 2).toUpperCase();
  
  return (
    <div className={`${styles.avatar} ${styles[size]}`} title={name}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
};
