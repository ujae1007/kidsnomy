import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChildSignupPage.module.css';

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add signup logic here
    console.log('Form submitted:', formData);
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