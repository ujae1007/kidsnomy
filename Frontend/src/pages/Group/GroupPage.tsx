import React from 'react';
import styles from './GroupPage.module.css';

const GroupPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>그룹 관리</h1>
      <div className={styles.content}>
        {/* 그룹 관리 컨텐츠는 추후 구현 */}
        <p>그룹 관리 페이지입니다.</p>
      </div>
    </div>
  );
};

export default GroupPage; 