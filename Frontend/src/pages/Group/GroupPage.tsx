import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './GroupPage.module.css';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import { setSelectedGroupId } from '@/store/slices/groupSlice';

interface Group {
  groupId: number;
  groupCode: string;
  ownerName: string;
}

interface CreateGroupResponse {
  groupCode: string;
}

// interface GroupParticipationRequest {
//   groupCode: string;
// }

const GroupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isParent, accessToken } = useSelector((state: RootState) => state.auth);
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redux store의 현재 상태를 콘솔에 출력
  useEffect(() => {
    console.log('현재 선택된 그룹 ID:', selectedGroupId);
  }, [selectedGroupId]);

  // 그룹 목록 조회
  useEffect(() => {
    const fetchGroups = async () => {
      if (!accessToken) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiCall<Group[]>('/group/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('받아온 그룹 목록:', response);
        setGroups(response);
      } catch (error) {
        console.error('그룹 목록 조회 중 에러 발생:', error);
        setError('그룹 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [accessToken]);

  const handleSelectGroup = (groupId: number) => {
    console.log('그룹 선택 시도:', groupId);
    
    try {
      dispatch(setSelectedGroupId(groupId));
      console.log('그룹 선택 완료. 저장된 groupId:', groupId);
      
      // 선택한 그룹의 정보 찾기
      const selectedGroup = groups.find(group => group.groupId === groupId);
      if (selectedGroup) {
        alert(`그룹이 선택되었습니다.\n그룹 이름: ${selectedGroup.ownerName}\n그룹 코드: ${selectedGroup.groupCode}`);
      }
    } catch (error) {
      console.error('그룹 선택 중 에러 발생:', error);
      alert('그룹 선택 중 오류가 발생했습니다.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('그룹 코드를 입력해주세요.');
      return;
    }

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await apiCall('/group/participation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          groupCode: searchQuery.trim()
        })
      });
      
      alert('그룹 참여가 완료되었습니다.');
      setSearchQuery(''); // 입력 필드 초기화
      
      // 그룹 목록 새로고침
      const updatedGroups = await apiCall<Group[]>('/group/check', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setGroups(updatedGroups);
      
    } catch (error: any) {
      console.error('그룹 참여 에러:', error);
      if (error.status === 404) {
        alert('해당 그룹이 존재하지 않습니다.');
      } else if (error.status === 409) {
        alert('이미 참여 중인 그룹입니다.');
      } else {
        alert('그룹 참여 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await apiCall<CreateGroupResponse>('/group/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      alert(`그룹이 생성되었습니다.\n그룹 코드: ${response.groupCode}`);
      
      // 그룹 목록 새로고침
      const updatedGroups = await apiCall<Group[]>('/group/check', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setGroups(updatedGroups);
    } catch (error: any) {
      console.error('그룹 생성 에러:', error);
      if (error.status === 403) {
        alert('부모 사용자만 그룹을 생성할 수 있습니다.');
      } else {
        alert('그룹 생성 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    // TODO: 그룹 삭제 로직 구현
    console.log('그룹 삭제:', groupId);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 처리
    if (/^\d*$/.test(value)) {
      setSearchQuery(value);
    }
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
        <h2 className={styles.sectionTitle}>그룹코드 입력</h2>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="그룹코드를 입력해주세요."
              className={styles.searchInput}
              maxLength={6}
            />
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
          {isLoading ? (
            <div className={styles.message}>로딩 중...</div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : groups.length === 0 ? (
            <div className={styles.message}>가입한 그룹이 없습니다.</div>
          ) : (
            groups.map((group) => (
              <div key={group.groupId} className={styles.groupItem}>
                <div className={styles.groupInfo}>
                  <span className={styles.groupName}>{group.ownerName}</span>
                  <span className={styles.groupCode}>그룹코드: {group.groupCode}</span>
                </div>
                <div className={styles.groupActions}>
                  <button
                    className={styles.selectButton}
                    onClick={() => handleSelectGroup(group.groupId)}
                  >
                    {selectedGroupId === group.groupId ? '선택됨' : '선택'}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteGroup(group.groupId.toString())}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage; 