import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';
import styles from './ChildJobButtonPage.module.css';
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
  const auth = useSelector((state: RootState) => state.auth);
  console.log('🔍 Redux Auth State:', auth);  // 전체 auth 상태 로깅
  
  // 상태 관리
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [contractedJobs, setContractedJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 일자리 데이터 가져오기
  const fetchJobs = async () => {
    console.log('🚀 자녀 일자리 목록 조회 시작', { 
      isAuthenticated: auth.isAuthenticated,
      groupId: auth.groupId,
      hasToken: !!auth.accessToken
    });

    if (!auth.isAuthenticated || !auth.accessToken) {
      console.log('❌ 인증되지 않은 상태');
      setError('로그인이 필요합니다.');
      return;
    }

    if (!auth.groupId) {
      console.log('❌ 그룹 ID가 없음');
      setError('그룹이 선택되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 1. 계약되지 않은 전체 일자리 조회
      const availableJobsUrl = `work/child/check/${auth.groupId}`;
      console.log('📡 사용 가능한 일자리 조회 시작:', {
        url: availableJobsUrl,
        groupId: auth.groupId
      });
      
      const availableJobsData = await apiCall<Job[]>(availableJobsUrl, {
        method: 'GET',
        auth: true
      });
      
      console.log('✅ 사용 가능한 일자리 조회 성공:', {
        count: availableJobsData?.length,
        jobs: availableJobsData
      });
      
      setAvailableJobs(availableJobsData);
      setFilteredJobs(availableJobsData);

      // 2. 계약된 일자리 조회
      const contractedJobsUrl = `work/child/contracted/${auth.groupId}`;
      console.log('📡 계약된 일자리 조회 시작:', {
        url: contractedJobsUrl,
        groupId: auth.groupId
      });
      
      const contractedJobsData = await apiCall<Job[]>(contractedJobsUrl, {
        method: 'GET',
        auth: true
      });
      
      console.log('✅ 계약된 일자리 조회 성공:', {
        count: contractedJobsData?.length,
        jobs: contractedJobsData
      });
      
      setContractedJobs(contractedJobsData);

    } catch (error: any) {
      console.error('❌ 일자리 목록 조회 실패:', error);
      if (error.status === 403) {
        setError('접근 권한이 없습니다.');
      } else {
        setError('일자리 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchJobs();
  }, [auth.groupId, auth.isAuthenticated]);
  
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
  
  // 일자리 상세보기로 이동
  const handleJobClick = (jobId: number) => {
    console.log('🔍 일자리 상세 보기 이동 (jobId:', jobId, ')');
    navigate(`/jobs/${jobId}`);
  };
  
  // 검색 및 필터링 적용
  useEffect(() => {
    // 모든 일자리를 하나의 배열로 합치기
    const allJobs = [...availableJobs, ...contractedJobs];
    let filtered = [...allJobs];

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
  }, [searchTerm, availableJobs, contractedJobs, selectedStatus, sortOrder]);

  const handleMoreClick = (jobId: number) => {
    // 메뉴 처리 로직
    console.log('More clicked for job:', jobId);
  };

  return (
    <div className={styles.container}>
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

      {error && <div className={styles.error}>{error}</div>}
      
      {/* 일자리 목록 */}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>일자리 목록</h2>
          {filteredJobs.length > 0 ? (
            <div className={styles.jobList}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.jobId}
                  status={STATUS_LABELS[job.status]}
                  title={job.title}
                  salary={job.salary}
                  onMoreClick={() => handleJobClick(job.jobId)}
                  onClick={() => handleJobClick(job.jobId)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noJobs}>
              {searchTerm ? '검색 결과가 없습니다.' : '일자리가 없습니다.'}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ChildJobListPage; 