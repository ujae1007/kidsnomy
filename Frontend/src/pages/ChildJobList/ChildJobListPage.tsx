import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setAvailableJobs, setContractedJobs } from '../../store/slices/jobSlice';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';
import styles from './ChildJobListPage.module.css';
import { apiCall } from '@/utils/api';
import JobCard from '@/components/jobs/JobCard';

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
  3: '승인대기',
  4: '최종완료'
};

const ChildJobListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  const { availableJobs, contractedJobs } = useSelector((state: RootState) => state.job);
  
  // 상태 관리
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isContractedView, setIsContractedView] = useState<boolean>(false);
  
  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // 그룹 선택 여부 확인
  useEffect(() => {
    if (!selectedGroupId) {
      alert('그룹을 먼저 선택해주세요.');
      navigate('/group');
      return;
    }
  }, [selectedGroupId, navigate]);
  
  // 일자리 데이터 가져오기
  const fetchJobs = async () => {
    if (!selectedGroupId || !accessToken) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const endpoint = isContractedView 
        ? `/work/child/contracted/${selectedGroupId}`
        : `/work/child/allcheck/${selectedGroupId}`;

      console.log(`📊 자녀 일자리 조회 시작 (${endpoint})`);
      
      const response = await apiCall<Job[]>(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('받아온 일자리 목록:', response);
      
      if (isContractedView) {
        dispatch(setContractedJobs(response || []));
      } else {
        dispatch(setAvailableJobs(response || []));
      }
      
      setFilteredJobs(response || []);
    } catch (error: any) {
      console.error('❌ 자녀 일자리 조회 중 에러 발생:', error);
      if (error.status === 403) {
        setError('접근 권한이 없습니다.');
      } else {
        setError('일자리 목록을 불러오는데 실패했습니다.');
      }
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시와 필터 변경 시 데이터 가져오기
  useEffect(() => {
    if (isAuthenticated && selectedGroupId) {
      fetchJobs();
    }
  }, [selectedGroupId, accessToken, isContractedView, isAuthenticated]);
  
  // 검색어 변경 처리
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  // 상태 필터 변경 처리
  const handleStatusFilterChange = (filter: string) => {
    if (filter === 'latest') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else if (filter === 'contracted') {
      setIsContractedView(!isContractedView);
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
    const currentJobs = isContractedView ? contractedJobs : availableJobs;
    let filtered = [...currentJobs];
    
    // 검색어 필터링
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(lowerSearchTerm) ||
        job.employerName.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 상태 필터링
    if (selectedStatus !== null) {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    // 생성 시간 기준 정렬
    filtered.sort((a, b) => {
      const dateA = new Date(a.startAt);
      const dateB = new Date(b.startAt);
      return sortOrder === 'asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });
    
    setFilteredJobs(filtered);
  }, [availableJobs, contractedJobs, searchTerm, selectedStatus, sortOrder, isContractedView]);

  return (
    <div className={styles.container}>
      {/* 검색 및 필터 영역 - 항상 표시 */}
      <div className={styles.controlsContainer}>
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        <FilterButtons
          selectedFilter={isContractedView ? 'contracted' : (selectedStatus?.toString() || 'all')}
          onFilterChange={handleStatusFilterChange}
          type="jobs"
        />
      </div>
      
      {/* 에러 메시지 */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={fetchJobs}
          >
            다시 시도
          </button>
        </div>
      )}
      
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
              <button 
                className={styles.menuButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobClick(job.jobId);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noJobs}>
            {error ? '일자리 목록을 불러올 수 없습니다.' : '해당하는 일자리가 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildJobListPage; 