import React from 'react';
import styles from './HomePage.module.css';
import AccountInfo from '../components/home/AccountInfo';
import WeeklyCalendar from '../components/calendar/WeeklyCalendar';
import FinancialProducts from '../components/home/FinancialProducts';

// 테스트용 더미 데이터
const dummyFinancialData = {
  contracts: [
    {
      contract_id: "1",
      title: "용돈 통장",
      content: "매주 일요일마다 용돈이 들어와요",
      account_id: "1234-5678-9012",
      balance: 50000,
      interest_rate: 3.5,
      end_day: "2024-12-31",
      rate_volume: 10000
    },
    {
      contract_id: "2",
      title: "목표 적금",
      content: "레고 사려고 모으는 중!",
      account_id: "9876-5432-1098",
      balance: 150000,
      interest_rate: 5.0,
      end_day: "2024-06-30",
      total_volume: 500000,
      one_time_volume: 50000
    },
    {
      contract_id: "3",
      title: "여행 적금",
      content: "여름 방학 여행 자금",
      account_id: "5555-6666-7777",
      balance: 200000,
      interest_rate: 4.5,
      end_day: "2024-07-31",
      total_volume: 1000000,
      rate_volume: 100000
    }
  ]
};

const HomePage = () => {
  return (
    <div className={styles.container}>
      <AccountInfo />
      <WeeklyCalendar />
      <FinancialProducts data={dummyFinancialData} />
    </div>
  );
};

export default HomePage; 