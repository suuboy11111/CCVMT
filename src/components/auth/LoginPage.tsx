import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';
import { LogIn, Rocket } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      alert("Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Rocket size={32} />
          </div>
          <h1>PreProject</h1>
          <p>Hệ thống quản lý Agile siêu tốc cho nhà phát triển</p>
        </div>
        
        <button className={styles.loginButton} onClick={handleLogin}>
          <LogIn size={20} />
          <span>Tiếp tục với Google</span>
        </button>

        <div className={styles.footer}>
          <span>Đồ án môn Công cụ & Môi trường Phát triển PM</span>
        </div>
      </div>
      
      <div className={styles.backgroundGlow}></div>
      <div className={styles.backgroundGlow2}></div>
    </div>
  );
};
