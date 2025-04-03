import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';
import styles from './ChildJobListPage.module.css';

// 일자리 데이터 타입 정의
interface Job {
  jobId: number;
  groupId: number;
  groupCode?: string;
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

const ChildJobListPage: React.FC = () => {
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
  const groupId = 1; // 예시 그룹 ID
  
  // 일자리 데이터 가져오기
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 자녀 일자리 조회 데이터 로딩 시작');
      
      // 임시 데이터로 대체
      const mockData: Job[] = [
        {
          jobId: 1,
          groupId: 1,
          employerId: 1,
          employeeId: null,
          employerName: "김부모",
          employeeName: null,
          title: "방 청소하기",
          content: "방 청소 부탁해요",
          salary: 5000,
          rewardText: "용돈 5000원",
          isPermanent: false,
          startAt: "2024-02-15T00:00:00",
          endAt: "2024-02-16T00:00:00",
          status: 1
        },
        {
          jobId: 2,
          groupId: 1,
          employerId: 1,
          employeeId: null,
          employerName: "이부모",
          employeeName: null,
          title: "설거지하기",
          content: "설거지 해주세요",
          salary: 3000,
          rewardText: "용돈 3000원",
          isPermanent: false,
          startAt: "2024-02-15T00:00:00",
          endAt: "2024-02-17T00:00:00",
          status: 2
        }
      ];
      
      setJobs(mockData);
      setFilteredJobs(mockData);
    } catch (error) {
      console.error('❌ 자녀 일자리 조회 중 에러 발생:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // 검색어 변경 처리
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  // 상태 필터 변경 처리
  const handleStatusFilterChange = (filter: string) => {
    if (filter === 'latest') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSelectedStatus(filter === 'all' ? null : Number(filter));
    }
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
  
  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      
      {!error && (
        <>
          {/* 검색 및 필터 영역 */}
          <div className={styles.controlsContainer}>
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            
            <FilterButtons
              selectedFilter={selectedStatus?.toString() || 'all'}
              onFilterChange={handleStatusFilterChange}
              type="jobs"
            />
          </div>
          
          {/* 일자리 목록 */}
          <div className={styles.jobList}>
            {loading ? (
              <div className={styles.loading}>로딩 중...</div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div 
                  key={job.jobId} 
                  onClick={() => handleJobClick(job.jobId)}
                  className={styles.jobCard}
                >
                  <div className={styles.jobStatus}>
                    {STATUS_LABELS[job.status] || '알 수 없음'}
                  </div>
                  <div className={styles.jobContent}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <p className={styles.jobSalary}>{job.salary.toLocaleString()}원</p>
                  </div>
                  <button className={styles.menuButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
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

export default ChildJobListPage; 