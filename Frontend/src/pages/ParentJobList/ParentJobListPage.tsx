import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

// 상태값에 대한 레이블
const STATUS_LABELS: Record<number, string> = {
  1: '계약전',
  2: '계약후',
  4: '최종완료'
};

// 목업 데이터
const MOCK_JOBS: Job[] = [
  {
    jobId: 1,
    title: '설거지 하기',
    salary: 1000,
    status: 1
  },
  {
    jobId: 2,
    title: '분리수거하기',
    salary: 2000,
    status: 2
  },
  {
    jobId: 3,
    title: '백덤블링하기',
    salary: 3000,
    status: 4
  },
  {
    jobId: 4,
    title: '책 읽고 독후감 쓰기',
    salary: 1000,
    status: 1
  }
];

const ParentJobListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [jobs] = useState<Job[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(MOCK_JOBS);
  const [loading] = useState<boolean>(false);
  
  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
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
  
  const handleJobClick = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };
  
  const handleCreateJob = () => {
    navigate('/parent/jobs/create');
  };
  
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
    
    setFilteredJobs(result);
  }, [jobs, searchTerm, selectedStatus, sortOrder]);
  
  return (
    <div className={styles.container}>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <CreateJobButton onClick={handleCreateJob} />
      
      <FilterButtons
        selectedFilter={selectedStatus?.toString() || (sortOrder === 'desc' ? 'latest' : 'all')}
        onFilterChange={handleStatusFilterChange}
      />
      
      <div className={styles.jobList}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard
              key={job.jobId}
              status={STATUS_LABELS[job.status] || '알 수 없음'}
              title={job.title}
              salary={job.salary}
              onMoreClick={() => handleJobClick(job.jobId)}
            />
          ))
        ) : (
          <div className={styles.noJobs}>해당하는 일자리가 없습니다.</div>
        )}
      </div>

      <ChatbotButton />
    </div>
  );
};

export default ParentJobListPage; 