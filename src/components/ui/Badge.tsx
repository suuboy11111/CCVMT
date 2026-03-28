import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  variant?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gray' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label}
    </span>
  );
};
