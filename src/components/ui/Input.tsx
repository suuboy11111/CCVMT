import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input className={`${styles.input} ${icon ? styles.hasIcon : ''}`} {...props} />
    </div>
  );
};
