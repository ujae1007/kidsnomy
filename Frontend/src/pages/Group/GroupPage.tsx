import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GroupPage.module.css';

interface Group {
  id: string;
  name: string;
}

const GroupPage: React.FC = () => {
  const navigate = useNavigate();
  // TODO: 실제 사용자 타입은 전역 상태나 API를 통해 가져와야 함
  const [isParent] = useState(true); // 임시로 부모 사용자로 설정

  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: '그룹장' },
    { id: '2', name: '그룹장' },
    { id: '3', name: '그룹장' },
  ]);

  const handleSearch = () => {
    // TODO: 그룹 코드로 검색 구현
    console.log('그룹 검색:', searchQuery);
  };

  const handleCreateGroup = () => {
    // TODO: 그룹 생성 로직 구현
    console.log('그룹 생성');
  };

  const handleDeleteGroup = (groupId: string) => {
    // TODO: 그룹 삭제 로직 구현
    console.log('그룹 삭제:', groupId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1A0D0D"/>
          </svg>
        </button>
        <h1 className={styles.title}>그룹 관리</h1>
        {isParent && (
          <button 
            className={styles.createButton}
            onClick={handleCreateGroup}
          >
            그룹생성
          </button>
        )}
      </div>

      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>그룹코드 검색</h2>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="그룹코드 검색"
              className={styles.searchInput}
            />
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.5306 18.4694L14.8366 13.7762C17.6629 10.383 17.3204 5.36693 14.0591 2.38935C10.7978 -0.588237 5.77134 -0.474001 2.64867 2.64867C-0.474001 5.77134 -0.588237 10.7978 2.38935 14.0591C5.36693 17.3204 10.383 17.6629 13.7762 14.8366L18.4694 19.5306C18.7624 19.8237 19.2376 19.8237 19.5306 19.5306C19.8237 19.2376 19.8237 18.7624 19.5306 18.4694ZM1.75 8.5C1.75 4.77208 4.77208 1.75 8.5 1.75C12.2279 1.75 15.25 4.77208 15.25 8.5C15.25 12.2279 12.2279 15.25 8.5 15.25C4.77379 15.2459 1.75413 12.2262 1.75 8.5Z" fill="#914F4F"/>
            </svg>
          </div>
          <button 
            className={styles.searchButton}
            onClick={handleSearch}
          >
            추가
          </button>
        </div>
      </div>

      <div className={styles.groupSection}>
        <h2 className={styles.sectionTitle}>그룹 목록</h2>
        <div className={styles.groupList}>
          {groups.map((group) => (
            <div key={group.id} className={styles.groupItem}>
              <span className={styles.groupName}>그룹장</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteGroup(group.id)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupPage; 