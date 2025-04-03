import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChildSignupPage.module.css';
import { apiCall } from '@/utils/api';

interface SignupResponse {
  message: string;
  success: boolean;
}

const ChildSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    parentEmail: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        parentEmail: formData.parentEmail
      };

      const response = await apiCall<SignupResponse>('/auth/signup/child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      if (response.success) {
        alert('자녀 회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      if (error.status === 400) {
        alert('존재하지 않는 부모 이메일입니다.');
      } else if (error.status === 409) {
        alert('해당 이메일은 이미 사용 중입니다.');
      } else {
        alert('회원가입 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>보호자 이메일</label>
          <input
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleChange}
            className={styles.input}
            placeholder="보호자 이메일을 입력하세요"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>나이</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={styles.input}
            placeholder="나이를 입력하세요"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>성별</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">선택하세요</option>
            <option value="Male">남성</option>
            <option value="Female">여성</option>
          </select>
        </div>

        <button type="submit" className={styles.signupButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default ChildSignupPage; 