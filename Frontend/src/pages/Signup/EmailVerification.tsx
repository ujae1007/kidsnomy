import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiCall } from '@/utils/api';
import { RootState } from '@/store';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  // Redux에서 이메일 가져오기
  const email = useSelector((state: RootState) => state.auth.email);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');
      
      const response = await apiCall<{ message: string }>('/auth/verification/email', {
        method: 'POST',
        body: JSON.stringify({ 
          email,
          verificationCode: parseInt(verificationCode)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert(response.message || '이메일 인증이 완료되었습니다.');
      navigate(-1); // 이전 페이지로 돌아가기
    } catch (error: any) {
      setError(error.message || '인증 코드가 일치하지 않습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <div>
      <div>
        <button onClick={handleClose}>X</button>
        <h2>이메일을 확인하세요.</h2>
        <p>이메일로 인증 코드를 발송해드렸습니다.</p>
        <p>코드를 입력해 주세요.</p>
        
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증 코드 입력"
        />
        
        {error && <p>{error}</p>}
        
        <button 
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? '인증 중...' : '인증하기'}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification; 