import React from 'react';
import styles from './JobInputField.module.css';

interface JobInputFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: 'text' | 'number' | 'textarea' | 'checkbox' | 'date';
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  isReadOnly?: boolean;
  inputMode?: string;
}

const JobInputField: React.FC<JobInputFieldProps> = ({
  label,
  name,
  value,
  type = 'text',
  onChange,
  required = false,
  isReadOnly = false,
}) => {
  if (isReadOnly) {
    return (
      <div className={styles.fieldContainer}>
        <span className={styles.label}>{label}</span>
        <div className={styles.readOnlyField}>
          {type === 'checkbox' ? (value === 'true' ? '예' : '아니오') : value}
        </div>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={styles.fieldContainer}>
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={styles.textareaField}
        />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className={styles.fieldContainer}>
        <label className={styles.label}>{label}</label>
        <div className={styles.toggleContainer}>
          <span className={styles.toggleDescription}>
            (루틴을 지정하면 일자리가 완료되어도 사라지지 않아요)
          </span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              name={name}
              checked={value === 'true'}
              onChange={onChange}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className={styles.fieldContainer}>
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
        <div className={styles.dateContainer}>
          <input
            type="date"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={styles.dateField}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.inputField}
      />
    </div>
  );
};

export default JobInputField; 