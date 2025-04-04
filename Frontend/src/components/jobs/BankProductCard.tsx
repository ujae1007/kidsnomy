import React from 'react';
import styles from './BankProductCard.module.css';
import JobStatusBadge from './JobStatusBadge';

interface BankProductCardProps {
  title: string;
  description: string;
  status: string;
  statusColor: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const BankProductCard: React.FC<BankProductCardProps> = ({
  title,
  description,
  status,
  statusColor,
  children,
  onClick
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <JobStatusBadge text={status} color={statusColor} />
      </div>
      <p className={styles.description}>{description}</p>
      {children}
    </div>
  );
};

export default BankProductCard;