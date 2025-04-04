import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SendMoneyResultPage.module.css';

interface SendMoneyResultState {
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  amount: number;
  transactionId: string;
  fromAccount: string;
  timestamp: string;
  errorMessage?: string;
}

const SendMoneyResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SendMoneyResultState;

  useEffect(() => {
    // 뒤로가기 방지
    const preventGoBack = (e: PopStateEvent) => {
      e.preventDefault();
      navigate('/home', { replace: true });
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', preventGoBack);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, [navigate]);

  console.log('💡 송금 결과 페이지 렌더링:', {
    status: state?.status,
    amount: state?.amount,
    transactionId: state?.transactionId
  });

  const getStatusMessage = () => {
    switch (state?.status) {
      case 'COMPLETED':
        return '송금이 완료되었습니다';
      case 'PENDING':
        return '송금이 진행 중입니다';
      case 'FAILED':
        return '송금에 실패했습니다';
      default:
        return '알 수 없는 상태';
    }
  };

  const getStatusDescription = () => {
    switch (state?.status) {
      case 'COMPLETED':
        return `${state.fromAccount} 계좌에서 ${state.amount.toLocaleString()}원이 정상적으로 송금되었습니다.`;
      case 'PENDING':
        return '송금 처리가 진행 중입니다. 잠시 후 다시 확인해주세요.';
      case 'FAILED':
        return state?.errorMessage || '송금 처리 중 오류가 발생했습니다.';
      default:
        return '송금 상태를 확인할 수 없습니다.';
    }
  };

  const getStatusIcon = () => {
    switch (state?.status) {
      case 'COMPLETED':
        return '✅';
      case 'PENDING':
        return '⏳';
      case 'FAILED':
        return '❌';
      default:
        return '❓';
    }
  };

  const handleHomeClick = () => {
    console.log('🏠 홈으로 이동');
    navigate('/home', { replace: true });
  };

  const handleRetryClick = () => {
    console.log('🔄 송금 페이지로 이동');
    navigate('/send-money', { replace: true });
  };

  if (!state) {
    console.warn('⚠️ 송금 결과 상태 없음');
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          잘못된 접근입니다.
        </div>
        <button className={styles.button} onClick={handleHomeClick}>
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{getStatusIcon()}</div>
      <h1 className={styles.title}>{getStatusMessage()}</h1>
      <p className={styles.description}>{getStatusDescription()}</p>
      
      {state.status === 'COMPLETED' && (
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span>거래 번호</span>
            <span>{state.transactionId}</span>
          </div>
          <div className={styles.detailItem}>
            <span>거래 시각</span>
            <span>{new Date(state.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        {state.status === 'FAILED' && (
          <button 
            className={`${styles.button} ${styles.retry}`}
            onClick={handleRetryClick}
          >
            다시 시도
          </button>
        )}
        <button 
          className={`${styles.button} ${styles.home}`}
          onClick={handleHomeClick}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default SendMoneyResultPage; 