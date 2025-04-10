import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './ParentJobListPage.module.css';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';
import JobCard from '@/components/jobs/JobCard';
import CreateJobButton from '@/components/jobs/CreateJobButton';
import ChatbotButton from '@/components/jobs/ChatbotButton';

// 일자리 데이터 타입 정의
interface Job {
  jobId: number;
  title: string;
  salary: number;
  status: number;
  employerName: string;
  isPermanent: boolean;
}

// 상태값에 대한 레이블
const STATUS_LABELS: Record<number, string> = {
  1: '계약전',
  2: '계약후',
  3: '승인대기',
  4: '최종완료'
};

const ParentJobListPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  
  // 상태 관리
  const [jobs, setJobs] = useState<Job[]>([]);
  const [displayJobs, setDisplayJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  useEffect(() => {
    if (!selectedGroupId) {
      alert('그룹을 먼저 선택해주세요.');
      navigate('/group');
      return;
    }
  }, [selectedGroupId, navigate]);
  
  // 일자리 데이터 가져오기
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 부모 일자리 조회 데이터 로딩 시작');
      const data = await apiCall<Job[]>(`work/parent/check/${selectedGroupId}`, {
        method: 'GET',
        auth: true,
      });
      
      console.log('✅ 부모 일자리 조회 성공:', { 
        jobCount: data.length, 
        jobs: data.map(job => ({ 
          title: job.title, 
          status: job.status,
          isPermanent: job.isPermanent, 
          employer: job.employerName 
        }))
      });
      
      setJobs(data);
      setDisplayJobs(data);
    } catch (err) {
      console.error('❌ 부모 일자리 조회 중 에러 발생:', err);
      
      const error = err as any;
      if (error?.status === 403 || (error?.message && error.message.includes('403'))) {
        setError('그룹을 생성하거나 선택해주세요.');
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleJobClick = (jobId: number) => {
    console.log(`🔍 일자리 상세 보기 이동 (jobId: ${jobId})`);
    navigate(`/jobs/${jobId}`);
  };
  
  const handleCreateJob = () => {
    navigate('/parent/jobs/create');
  };

  const handleStatusFilterChange = (status: string) => {
    if (status === 'all') {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(Number(status));
    }
  };
  
  useEffect(() => {
    fetchJobs();
  }, [selectedGroupId]);
  
  useEffect(() => {
    let result = [...jobs];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        job => job.title.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (selectedStatus !== null) {
      result = result.filter(job => job.status === selectedStatus);
    }

    // 최신순/과거순 정렬
    result.sort((a, b) => {
      return sortOrder === 'desc' ? b.jobId - a.jobId : a.jobId - b.jobId;
    });
    
    setDisplayJobs(result);
  }, [jobs, searchTerm, selectedStatus, sortOrder]);
  
  return (
    <div className={styles.container}>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <CreateJobButton onClick={handleCreateJob} />
      
      <FilterButtons
        selectedFilter={selectedStatus?.toString() || 'all'}
        onFilterChange={handleStatusFilterChange}
        type="jobs"
      />
      
      <div className={styles.jobList}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            {error.includes('그룹') && (
              <button 
                className={styles.error}
                onClick={() => navigate('/group')}
              >
                그룹 생성하기
              </button>
            )}
          </div>
        ) : displayJobs.length > 0 ? (
          displayJobs.map(job => (
            <JobCard
              key={job.jobId}
              status={STATUS_LABELS[job.status] || '알 수 없음'}
              title={job.title}
              salary={job.salary}
              isPermanent={job.isPermanent}
              onMoreClick={() => handleJobClick(job.jobId)}
              onClick={() => handleJobClick(job.jobId)}
            />
          ))
        ) : (
          <div className={styles.noJobs}>일자리 정보가 없습니다.</div>
        )}
      </div>

      <ChatbotButton />
    </div>
  );
};

export default ParentJobListPage;
