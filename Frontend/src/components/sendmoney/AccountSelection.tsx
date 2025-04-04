import React, { useEffect } from 'react';
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
  useEffect(() => {
    console.log('🏦 계좌 목록 렌더링:', {
      totalAccounts: accounts.length,
      accounts: accounts.map(acc => ({
        id: acc.id,
        type: acc.type,
        maskedNumber: acc.accountNumber
      }))
    });
  }, [accounts]);

  const handleAccountSelect = (accountId: string) => {
    console.log('✅ 계좌 선택:', {
      selectedId: accountId,
      selectedAccount: accounts.find(acc => acc.id === accountId)
    });
    onAccountSelect(accountId);
  };

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
            onClick={() => handleAccountSelect(account.id)}
            aria-selected={selectedAccountId === account.id}
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