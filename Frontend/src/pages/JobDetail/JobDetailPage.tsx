import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './JobDetailPage.module.css';

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

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, isParent } = useSelector((state: RootState) => state.auth);
  
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
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
    
    if (!isAuthenticated) {
      console.log('❌ 인증되지 않은 사용자');
      navigate('/login');
      return;
    }
    
    const fetchJobDetail = async () => {
      console.log(`🔍 일자리 상세 정보 조회 시도 (jobId: ${jobId})`);
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/work/check/detail/${jobId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        
        console.log(`🔄 일자리 상세 정보 응답 상태: ${response.status}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('일자리를 찾을 수 없습니다.');
          } else if (response.status === 403) {
            throw new Error('해당 일자리에 접근할 권한이 없습니다.');
          } else {
            throw new Error('일자리 정보를 불러오는데 실패했습니다.');
          }
        }
        
        const data = await response.json();
        console.log('✅ 일자리 상세 정보 조회 성공:', data);
        setJob(data);
      } catch (error) {
        console.error('❌ 일자리 상세 정보 조회 중 에러 발생:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetail();
    
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
      const response = await fetch(`/api/work/delete/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      console.log(`🔄 일자리 삭제 응답 상태: ${response.status}`);
      
      // 응답 상태에 따른 처리
      if (response.ok) {
        console.log('✅ 일자리 삭제 성공');
        alert('일자리가 삭제 되었습니다.');
        navigate('/parent/jobs');
        return;
      }
      
      // 오류 상태에 따른 처리
      const errorText = await response.text();
      console.error('❌ 일자리 삭제 실패:', errorText);
      
      switch (response.status) {
        case 400:
          throw new Error('이미 계약된 일자리는 삭제할 수 없습니다.');
        case 403:
          if (errorText.includes('부모만')) {
            throw new Error('부모만 일자리를 삭제할 수 있습니다.');
          } else {
            throw new Error('본인이 생성한 일자리만 삭제할 수 있습니다.');
          }
        case 404:
          throw new Error('해당 일자리가 존재하지 않습니다.');
        default:
          throw new Error('일자리 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 일자리 삭제 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleAcceptJob = async () => {
    console.log(`👍 일자리 수락(계약) 시도 (jobId: ${jobId})`);
    
    if (!confirm('이 일자리를 수락하시겠습니까? 수락하면 계약이 체결됩니다.')) {
      console.log('❌ 일자리 수락 취소됨');
      return;
    }
    
    try {
      console.log(`📤 API 요청: PUT /api/work/child/contract/${jobId}`);
      const response = await fetch(`/api/work/child/contract/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      console.log(`🔄 일자리 수락(계약) 응답 상태: ${response.status} ${response.statusText}`);
      console.log(`🔑 인증 토큰 사용됨: ${accessToken ? 'Bearer ' + accessToken.substring(0, 10) + '...' : '없음'}`);
      
      // 응답 상태에 따른 처리
      if (response.ok) {
        console.log('✅ 일자리 수락(계약) 성공');
        alert('일자리가 성공적으로 계약되었습니다.');
        window.location.reload();
        return;
      }
      
      // 오류 상태에 따른 처리
      let errorText = '';
      try {
        // JSON 응답 시도
        const errorJson = await response.json();
        errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson);
        console.error('❌ 일자리 수락(계약) 실패 (JSON):', errorJson);
      } catch {
        // 일반 텍스트 응답
        errorText = await response.text();
        console.error('❌ 일자리 수락(계약) 실패 (Text):', errorText);
      }
      
      switch (response.status) {
        case 403:
          if (errorText.includes('자녀만')) {
            throw new Error('자녀만 일자리를 계약할 수 있습니다.');
          } else if (errorText.includes('그룹')) {
            throw new Error('본인이 속한 그룹의 일자리가 아닙니다.');
          } else {
            throw new Error(`접근이 거부되었습니다: ${errorText}`);
          }
        case 404:
          throw new Error('일자리가 존재하지 않습니다.');
        case 400:
          throw new Error('이미 계약된 일자리입니다.');
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        default:
          throw new Error(`일자리 계약에 실패했습니다 (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('❌ 일자리 수락(계약) 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleCompleteJob = async () => {
    console.log(`🏁 일자리 완료 요청 시도 (jobId: ${jobId})`);
    
    if (!confirm('정말로 이 일자리를 완료로 표시하시겠습니까? 완료 후에는 취소할 수 없습니다.')) {
      console.log('❌ 일자리 완료 요청 취소됨');
      return;
    }
    
    try {
      console.log(`📤 API 요청: PUT /api/work/child/complete/${jobId}`);
      const response = await fetch(`/api/work/child/complete/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      console.log(`🔄 일자리 완료 요청 응답 상태: ${response.status} ${response.statusText}`);
      console.log(`🔑 인증 토큰 사용됨: ${accessToken ? 'Bearer ' + accessToken.substring(0, 10) + '...' : '없음'}`);
      
      // 응답 상태에 따른 처리
      if (response.ok) {
        console.log('✅ 일자리 완료 요청 성공');
        alert('일자리 완료 요청이 정상적으로 처리되었습니다.');
        window.location.reload();
        return;
      }
      
      // 오류 상태에 따른 처리
      let errorText = '';
      try {
        // JSON 응답 시도
        const errorJson = await response.json();
        errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson);
        console.error('❌ 일자리 완료 요청 실패 (JSON):', errorJson);
      } catch {
        // 일반 텍스트 응답
        errorText = await response.text();
        console.error('❌ 일자리 완료 요청 실패 (Text):', errorText);
      }
      
      switch (response.status) {
        case 403:
          if (errorText.includes('자녀만')) {
            throw new Error('자녀만 완료 요청을 할 수 있습니다.');
          } else if (errorText.includes('본인이 계약한')) {
            throw new Error('본인이 계약한 일자리가 아닙니다.');
          } else {
            throw new Error(`접근이 거부되었습니다: ${errorText}`);
          }
        case 404:
          if (errorText.includes('사용자')) {
            throw new Error('사용자를 찾을 수 없습니다.');
          } else {
            throw new Error('일자리를 찾을 수 없습니다.');
          }
        case 400:
          throw new Error('진행 중인 일자리만 완료 요청이 가능합니다.');
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        default:
          throw new Error(`일자리 완료 요청에 실패했습니다 (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('❌ 일자리 완료 요청 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleApproveJob = async () => {
    console.log(`✓ 일자리 승인 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`/api/work/approve/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      console.log(`🔄 일자리 승인 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 승인에 실패했습니다.');
      }
      
      console.log('✅ 일자리 승인 성공');
      window.location.reload();
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
        return (
          <button 
            onClick={handleDeleteJob} 
            className={`${styles.button} ${styles.warningButton}`}
          >
            삭제
          </button>
        );
      } else if (job.status === 3) {
        return (
          <button 
            onClick={handleApproveJob} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            승인
          </button>
        );
      }
    } else {
      // 자녀인 경우
      if (job.status === 1) {
        return (
          <button 
            onClick={handleAcceptJob} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            수락
          </button>
        );
      } else if (job.status === 2) {
        return (
          <button 
            onClick={handleCompleteJob} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            일을 다 끝냈어요
          </button>
        );
      }
    }
    
    return null;
  };
  
  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  if (!job) {
    return <div className={styles.error}>일자리 정보를 찾을 수 없습니다.</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>일자리 상세보기</h1>
      
      <div>
        <h2 className={styles.subTitle}>{job.title}</h2>
        <div className={styles.statusTag}>상태: {getStatusText(job.status)}</div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>날짜</h3>
          <p className={styles.sectionContent}>{formatDate(job.startAt)} ~ {formatDate(job.endAt)}</p>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>상세내용</h3>
          <p className={styles.sectionContent}>{job.content}</p>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>급여</h3>
          <p className={styles.sectionContent}>{job.salary.toLocaleString()}원</p>
        </div>
        
        {job.rewardText && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>추가보상</h3>
            <p className={styles.sectionContent}>{job.rewardText}</p>
          </div>
        )}
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>정보</h3>
          <p className={styles.sectionContent}>고용주: {job.employerName}</p>
          {job.employeeId && <p className={styles.sectionContent}>근로자: {job.employeeName}</p>}
          <p className={styles.sectionContent}>그룹 코드: {job.groupCode}</p>
          <p className={styles.sectionContent}>루틴 여부: {job.isPermanent ? '예' : '아니오'}</p>
        </div>
        
        <div className={styles.buttonsContainer}>
          {renderActionButton()}
          <button 
            onClick={() => navigate(-1)} 
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage; 