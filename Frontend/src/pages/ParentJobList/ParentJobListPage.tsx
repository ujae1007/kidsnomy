import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './ParentJobListPage.module.css';

// 일자리 데이터 타입 정의
interface Job {
  jobId: number;
  groupId: number;
  groupCode: string;
  employerId: number;
  employeeId: number | null;
  employerName: string;
  employeeName: string | null;
  title: string;
  content: string;
  salary: number;
  rewardText: string;
  isPermanent: boolean;
  startAt: string;
  endAt: string;
  status: number;
}

// 상태값에 대한 레이블
const STATUS_LABELS: Record<number, string> = {
  1: '계약전',
  2: '계약후',
  4: '최종완료'
};

const ParentJobListPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, isParent } = useSelector((state: RootState) => state.auth);
  
  // 상태 관리
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 그룹 ID는 추후 동적으로 가져오거나 사용자 선택으로 변경 가능
  const groupId = 2; // 예시 그룹 ID
  
  // 일자리 데이터 가져오기
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 부모 일자리 조회 데이터 로딩 시작');
      const response = await fetch(`/api/work/parent/check/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 부모 일자리 조회 응답 상태: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          const errorText = await response.text();
          console.error('❌ 접근 거부됨:', errorText);
          throw new Error(errorText || '접근이 거부되었습니다.');
        }
        throw new Error('일자리 정보를 가져오는 데 실패했습니다.');
      }
      
      const data = await response.json();
      console.log('✅ 부모 일자리 조회 성공:', { 
        jobCount: data.length, 
        jobs: data.map((job: Job) => ({ 
          title: job.title, 
          status: job.status, 
          employer: job.employerName 
        }))
      });
      
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('❌ 부모 일자리 조회 중 에러 발생:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    // 권한 체크
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isParent === false) {
      setError('부모 계정만 접근할 수 있습니다.');
      return;
    }
    
    fetchJobs();
  }, [isAuthenticated, isParent, navigate]);
  
  // 검색어 변경 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 상태 필터 변경 처리
  const handleStatusFilterChange = (status: number | null) => {
    setSelectedStatus(status);
  };
  
  // 정렬 순서 변경 처리
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // 일자리 생성 페이지로 이동
  const handleCreateJob = () => {
    navigate('/parent/jobs/create');
  };
  
  // 일자리 상세 페이지로 이동
  const handleJobClick = (jobId: number) => {
    console.log(`🔍 일자리 상세 보기 이동 (jobId: ${jobId})`);
    navigate(`/jobs/${jobId}`);
  };
  
  // 검색 및 필터링 적용
  useEffect(() => {
    let result = [...jobs];
    
    // 검색어 필터링
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        job => 
          job.title.toLowerCase().includes(lowerSearchTerm) || 
          job.employerName.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // 상태 필터링
    if (selectedStatus !== null) {
      result = result.filter(job => job.status === selectedStatus);
    }
    
    // 날짜 기준 정렬 (endAt 기준)
    result.sort((a, b) => {
      const dateA = new Date(a.endAt.split('T')[0]);
      const dateB = new Date(b.endAt.split('T')[0]);
      
      return sortOrder === 'asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });
    
    setFilteredJobs(result);
  }, [jobs, searchTerm, selectedStatus, sortOrder]);
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    return dateString.split('T')[0]; // YYYY-MM-DD 형식으로 변환
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>일자리 조회</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {!error && (
        <>
          {/* 검색 및 필터 영역 */}
          <div className={styles.controlsContainer}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="제목 또는 부모 이름으로 검색"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.filterContainer}>
              <button 
                onClick={() => handleStatusFilterChange(null)}
                className={`${styles.filterButton} ${selectedStatus === null ? styles.active : ''}`}
              >
                전체
              </button>
              <button 
                onClick={() => handleStatusFilterChange(1)}
                className={`${styles.filterButton} ${selectedStatus === 1 ? styles.active : ''}`}
              >
                계약전
              </button>
              <button 
                onClick={() => handleStatusFilterChange(2)}
                className={`${styles.filterButton} ${selectedStatus === 2 ? styles.active : ''}`}
              >
                계약후
              </button>
              <button 
                onClick={() => handleStatusFilterChange(4)}
                className={`${styles.filterButton} ${selectedStatus === 4 ? styles.active : ''}`}
              >
                최종완료
              </button>
              
              <button 
                onClick={handleSortOrderChange}
                className={styles.sortButton}
              >
                {sortOrder === 'asc' ? '날짜 오름차순' : '날짜 내림차순'}
              </button>
            </div>
            
            {isParent && (
              <button 
                onClick={handleCreateJob}
                className={styles.createButton}
              >
                일자리 만들기
              </button>
            )}
          </div>
          
          {/* 일자리 목록 */}
          <div className={styles.jobList}>
            {loading ? (
              <div className={styles.loading}>로딩 중...</div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div 
                  key={job.jobId} 
                  className={styles.jobCard}
                  onClick={() => handleJobClick(job.jobId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.jobStatus}>{STATUS_LABELS[job.status] || '알 수 없음'}</div>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <div className={styles.jobDetails}>
                    <p>급여: {job.salary.toLocaleString()}원</p>
                    <p>마감일: {formatDate(job.endAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noJobs}>해당하는 일자리가 없습니다.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ParentJobListPage; 