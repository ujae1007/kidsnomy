import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignupData {
  email: string;
  password: string;
  name: string;
  is_Parent: string;
  age: string;
  gender: string;
  parent_email: string;
}

const ChildSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    is_Parent: '0',
    age: '',
    gender: '',
    parent_email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('api/auth/signup/child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl mb-8">회원가입</h1>
        
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

          <div>
            <input
              type="text"
              name="email"
              value={signupData.email}
              onChange={handleInputChange}
              placeholder="아이디"
              required
            />
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
              type="email"
              name="parent_email"
              value={signupData.parent_email}
              onChange={handleInputChange}
              placeholder="보호자 이메일"
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

          <button 
            type="submit"
            className="w-full p-4 bg-pink-400 text-white rounded"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChildSignupPage; 