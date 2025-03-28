import React from 'react';
import styles from './AccountSelection.module.css';
import { Account } from '../../types/account';

interface AccountSelectionProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string) => void;
}

const AccountSelection: React.FC<AccountSelectionProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>상품 선택</h2>
      <div className={styles.accountList}>
        {accounts.map((account) => (
          <button
            key={account.id}
            className={`${styles.accountButton} ${
              selectedAccountId === account.id ? styles.selected : ''
            }`}
            onClick={() => onAccountSelect(account.id)}
          >
            <span className={styles.accountType}>{account.type}</span>
            <span className={styles.accountNumber}>{account.accountNumber}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountSelection; 