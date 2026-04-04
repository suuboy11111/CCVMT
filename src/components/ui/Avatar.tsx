import React, { useState } from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  
  // Lấy chữ cái đầu tiên của mỗi từ (tối đa 2 chữ)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const showImage = src && !imgError;

  return (
    <div className={`${styles.avatar} ${styles[size]}`} title={name}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          className={styles.image}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
};
