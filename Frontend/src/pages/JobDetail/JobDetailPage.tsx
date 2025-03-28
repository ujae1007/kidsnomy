import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './JobDetailPage.module.css';
import JobInputField from '@/components/jobs/JobInputField';

interface Job {
  jobId: number;
  groupId: number;
  groupCode: string;
  employerId: number;
  employeeId: number;
  employerName: string;
  employeeName: string;
  title: string;
  content: string;
  salary: number;
  rewardText: string;
  isPermanent: boolean;
  startAt: string;
  endAt: string;
  status: number;
}

// 더미 데이터
const dummyJob: Job = {
  jobId: 1,
  groupId: 1,
  groupCode: "TEST123",
  employerId: 1,
  employeeId: 2,
  employerName: "엄마",
  employeeName: "아들",
  title: "방 청소하기",
  content: "1. 침대 정리하기\n2. 바닥 쓸기\n3. 먼지 닦기\n4. 쓰레기 버리기",
  salary: 5000,
  rewardText: "아이스크림 사주기",
  isPermanent: true,
  startAt: "2024-03-20",
  endAt: "2024-03-20",
  status: 1
};

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, isParent } = useSelector((state: RootState) => state.auth);
  
  const [job, setJob] = useState<Job | null>(dummyJob); // 더미 데이터로 초기화
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태를 false로 설정
  
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1: return '계약전';
      case 2: return '계약후';
      case 3: return '승인대기';
      case 4: return '최종완료';
      default: return '알 수 없음';
    }
  };
  
  useEffect(() => {
    console.log('📄 일자리 상세 페이지 마운트, jobId:', jobId);
    
    // API 호출 부분을 주석 처리하고 더미 데이터 사용
    // const fetchJobDetail = async () => {
    //   console.log(`🔍 일자리 상세 정보 조회 시도 (jobId: ${jobId})`);
    //   setLoading(true);
    //   setError(null);
      
    //   try {
    //     const response = await fetch(`https://j12b207.p.ssafy.io/api/work/check/detail/${jobId}`, {
    //       method: 'GET',
    //       headers: {
    //         // 'Authorization': `Bearer ${accessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });
        
    //     console.log(`🔄 일자리 상세 정보 응답 상태: ${response.status}`);
        
    //     if (!response.ok) {
    //       if (response.status === 404) {
    //         throw new Error('일자리를 찾을 수 없습니다.');
    //       } else if (response.status === 403) {
    //         throw new Error('해당 일자리에 접근할 권한이 없습니다.');
    //       } else {
    //         throw new Error('일자리 정보를 불러오는데 실패했습니다.');
    //       }
    //     }
        
    //     const data = await response.json();
    //     console.log('✅ 일자리 상세 정보 조회 성공:', data);
    //     setJob(data);
    //   } catch (error) {
    //     console.error('❌ 일자리 상세 정보 조회 중 에러 발생:', error);
    //     setError((error as Error).message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchJobDetail();
    
    return () => {
      console.log('📄 일자리 상세 페이지 언마운트');
    };
  }, [jobId, accessToken, isAuthenticated, navigate]);
  
  const handleDeleteJob = async () => {
    if (!confirm('정말로 이 일자리를 삭제하시겠습니까?')) {
      return;
    }
    
    console.log(`🗑️ 일자리 삭제 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/delete/${jobId}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 삭제 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 삭제에 실패했습니다.');
      }
      
      console.log('✅ 일자리 삭제 성공');
      navigate('/parent/jobs');
    } catch (error) {
      console.error('❌ 일자리 삭제 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleAcceptJob = async () => {
    console.log(`👍 일자리 수락 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/accept/${jobId}`, {
        method: 'PUT',
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 수락 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 수락에 실패했습니다.');
      }
      
      console.log('✅ 일자리 수락 성공');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('❌ 일자리 수락 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleCompleteJob = async () => {
    console.log(`🏁 일자리 완료 요청 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/complete/${jobId}`, {
        method: 'PUT',
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 완료 요청 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 완료 요청에 실패했습니다.');
      }
      
      console.log('✅ 일자리 완료 요청 성공');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('❌ 일자리 완료 요청 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleApproveJob = async () => {
    console.log(`✓ 일자리 승인 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/approve/${jobId}`, {
        method: 'PUT',
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 승인 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 승인에 실패했습니다.');
      }
      
      console.log('✅ 일자리 승인 성공');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('❌ 일자리 승인 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const renderActionButton = () => {
    if (!job) return null;
    
    if (isParent) {
      // 부모인 경우
      if (job.status === 1) {
        return <button onClick={handleDeleteJob}>삭제</button>;
      } else if (job.status === 3) {
        return <button onClick={handleApproveJob}>승인</button>;
      }
    } else {
      // 자녀인 경우
      if (job.status === 1) {
        return <button onClick={handleAcceptJob}>수락</button>;
      } else if (job.status === 2) {
        return <button onClick={handleCompleteJob}>일을 다 끝냈어요</button>;
      }
    }
    
    return null;
  };
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  if (!job) {
    return <div>일자리 정보를 찾을 수 없습니다.</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{job.title}</h1>
        <span className={styles.status}>{getStatusText(job.status)}</span>
      </div>

      <div className={styles.infoSection}>
        <JobInputField
          label="등록자"
          name="employerName"
          value={job.employerName}
          isReadOnly={true}
        />
        <JobInputField
          label="급여"
          name="salary"
          value={`${job.salary.toLocaleString()}원`}
          isReadOnly={true}
        />
        {job.rewardText && (
          <JobInputField
            label="추가 보상"
            name="rewardText"
            value={job.rewardText}
            isReadOnly={true}
          />
        )}
        <JobInputField
          label="시작일"
          name="startAt"
          value={formatDate(job.startAt)}
          type="date"
          isReadOnly={true}
        />
        <JobInputField
          label="종료일"
          name="endAt"
          value={formatDate(job.endAt)}
          type="date"
          isReadOnly={true}
        />
        <JobInputField
          label="루틴 여부"
          name="isPermanent"
          value={job.isPermanent ? 'true' : 'false'}
          type="checkbox"
          isReadOnly={true}
        />
      </div>

      <div className={styles.contentSection}>
        <h2 className={styles.contentTitle}>상세 내용</h2>
        <JobInputField
          label=""
          name="content"
          value={job.content}
          type="textarea"
          isReadOnly={true}
        />
      </div>

      <div className={styles.buttonContainer}>
        {renderActionButton()}
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    </div>
  );
};

export default JobDetailPage; 