import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@/pages/ChildSignupPage.module.css';

const ChildSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    guardianEmail: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log('아이 회원가입 페이지: 입력 필드 변경', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.log('아이 회원가입 페이지: 비밀번호 불일치');
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('아이 회원가입 페이지: 회원가입 시도', formData);

    try {
      const response = await fetch('api/auth/signup/child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('아이 회원가입 페이지: 회원가입 응답 상태', response.status);

      if (response.ok) {
        console.log('아이 회원가입 페이지: 회원가입 성공');
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        console.log('아이 회원가입 페이지: 회원가입 실패');
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('아이 회원가입 페이지: 회원가입 에러', error);
      alert('회원가입 중 오류가 발생했습니다.');
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
          />
        </div>

        <div className={styles.inputGroup}>
          <label>아이디</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className={styles.input}
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>보호자 이메일</label>
          <input
            type="email"
            name="guardianEmail"
            value={formData.guardianEmail}
            onChange={handleChange}
            className={styles.input}
            placeholder="보호자 이메일을 입력하세요"
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
          />
        </div>

        <div className={styles.inputGroup}>
          <label>성별</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              남자
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              여자
            </label>
          </div>
        </div>

        <button type="submit" className={styles.signupButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default ChildSignupPage; 