import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SendMoneyPage.module.css';

import SendHeader from '@/components/sendmoney/SendHeader';
import AmountInput from '@/components/sendmoney/AmountInput';
import AccountSelection from '@/components/sendmoney/AccountSelection';
import SendButton from '@/components/sendmoney/SendButton';
import { Account } from '@/types/account';

const dummyAccounts: Account[] = [
  {
    id: '1',
    accountNumber: '****1234',
    type: '정기 예금',
  },
  {
    id: '2',
    accountNumber: '****9012',
    type: '정기 적금',
  },
];

const SendMoneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  const handleSend = () => {
    // TODO: 송금 처리 로직 구현
    console.log('송금 처리:', {
      amount,
      selectedAccountId,
    });
  };

  const isValid = amount !== '' && selectedAccountId !== null;

  return (
    <div className={styles.container}>
      <SendHeader />
      <main className={styles.main}>
        <AmountInput amount={amount} onAmountChange={handleAmountChange} />
        <AccountSelection
          accounts={dummyAccounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
        />
      </main>
      <footer className={styles.footer}>
        <SendButton isValid={isValid} onSend={handleSend} />
      </footer>
    </div>
  );
};

export default SendMoneyPage; 