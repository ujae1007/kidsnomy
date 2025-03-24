import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignupData {
  email: string;
  password: string;
  name: string;
  is_Parent: string;
  age: string;
  gender: string;
  parent_email: string | null;
}

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
}) => {
  const [verificationCode, setVerificationCode] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    console.log('이메일 인증 모달: 인증 코드 입력', verificationCode);
    onVerify(verificationCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">이메일을 확인하세요.</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>
        <p className="mb-4">이메일로 인증 코드를 발송해드렸습니다.</p>
        <p className="mb-4">코드를 입력해 주세요.</p>
        <div className="space-y-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증 코드를 입력하세요"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleVerify}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            인증하기
          </button>
        </div>
      </div>
    </div>
  );
};

const ParentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    is_Parent: '1',
    age: '',
    gender: '',
    parent_email: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('부모 회원가입 페이지: 입력 필드 변경', { name, value });
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailVerification = async () => {
    console.log('부모 회원가입 페이지: 이메일 인증 요청', signupData.email);
    try {
      const response = await fetch('api/auth/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signupData.email }),
      });

      console.log('부모 회원가입 페이지: 이메일 인증 요청 응답 상태', response.status);

      if (response.ok) {
        setIsVerificationModalOpen(true);
        console.log('부모 회원가입 페이지: 이메일 인증 모달 표시');
      } else {
        console.log('부모 회원가입 페이지: 이메일 인증 요청 실패');
        alert('이메일 인증 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('부모 회원가입 페이지: 이메일 인증 요청 에러', error);
      alert('이메일 인증 요청 중 오류가 발생했습니다.');
    }
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    console.log('부모 회원가입 페이지: 인증 코드 확인 시도', code);
    try {
      const response = await fetch('api/auth/verification/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          code: code,
        }),
      });

      console.log('부모 회원가입 페이지: 인증 코드 확인 응답 상태', response.status);

      if (response.ok) {
        setIsEmailVerified(true);
        setIsVerificationModalOpen(false);
        console.log('부모 회원가입 페이지: 이메일 인증 성공');
        alert('이메일 인증이 완료되었습니다.');
      } else {
        console.log('부모 회원가입 페이지: 인증 코드 확인 실패');
        alert('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('부모 회원가입 페이지: 인증 코드 확인 에러', error);
      alert('인증 코드 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      console.log('부모 회원가입 페이지: 이메일 미인증 상태');
      alert('이메일 인증이 필요합니다.');
      return;
    }

    if (signupData.password !== passwordConfirm) {
      console.log('부모 회원가입 페이지: 비밀번호 불일치');
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('부모 회원가입 페이지: 회원가입 시도', signupData);

    try {
      const response = await fetch('api/auth/signup/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      console.log('부모 회원가입 페이지: 회원가입 응답 상태', response.status);

      if (response.ok) {
        console.log('부모 회원가입 페이지: 회원가입 성공');
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        console.log('부모 회원가입 페이지: 회원가입 실패');
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('부모 회원가입 페이지: 회원가입 에러', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl mb-8">부모 회원가입</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleInputChange}
              placeholder="이름"
              required
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleInputChange}
              placeholder="이메일"
              required
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              disabled={isEmailVerified}
            >
              인증
            </button>
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleInputChange}
              placeholder="비밀번호 (영문+숫자+특수문자)"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 확인"
              required
            />
          </div>

          <div>
            <input
              type="number"
              name="age"
              value={signupData.age}
              onChange={handleInputChange}
              placeholder="나이"
              required
            />
          </div>

          <div>
            <select
              name="gender"
              value={signupData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">성별 선택</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>

          <button type="submit">
            회원가입
          </button>
        </form>
      </div>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationCodeSubmit}
      />
    </div>
  );
};

export default ParentSignupPage; 