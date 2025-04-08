import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WeeklyCalendar.module.css';

interface Schedule {
  user_id: number;
  user_name: string;
  start_day: string;
  end_day: string;
  title: string;
  content: string;
  salary: number;
  is_permanent: boolean;
  reward_text: string;
  status: number;
  contract_id: number;
  contractor_name: string;
}

interface WeeklyCalendarProps {
  contracts?: Schedule[];
}

// 현재 날짜 기준으로 이번 주의 날짜들을 얻기
const getCurrentWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const weekDates = getCurrentWeekDates();

// 더미 데이터
const dummyData: Schedule[] = [
  {
    user_id: 1,
    user_name: "김부모",
    start_day: weekDates[0], // 월요일
    end_day: weekDates[2],   // 수요일
    title: "방 청소하기",
    content: "방 청소와 정리정돈을 해주세요",
    salary: 5000,
    is_permanent: false,
    reward_text: "용돈 5000원",
    status: 2,  // 진행중
    contract_id: 1,
    contractor_name: "김자녀"
  },
  {
    user_id: 1,
    user_name: "김부모",
    start_day: weekDates[3], // 목요일
    end_day: weekDates[4],   // 금요일
    title: "설거지 돕기",
    content: "저녁 설거지를 도와주세요",
    salary: 3000,
    is_permanent: true,
    reward_text: "용돈 3000원",
    status: 3,  // 완료 대기
    contract_id: 2,
    contractor_name: "김자녀"
  },
  {
    user_id: 1,
    user_name: "김부모",
    start_day: weekDates[5], // 토요일
    end_day: weekDates[6],   // 일요일
    title: "주말 공부하기",
    content: "주말 동안 학교 숙제하기",
    salary: 10000,
    is_permanent: false,
    reward_text: "용돈 10000원",
    status: 4,  // 완료
    contract_id: 3,
    contractor_name: "김자녀"
  }
];

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ contracts }) => {
  const navigate = useNavigate();
  // contracts가 비어있으면 더미 데이터 사용
  const displayContracts = contracts?.length ? contracts : dummyData;
  
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  // 일정의 시작 요일 인덱스 구하기
  const getStartDayIndex = (schedule: Schedule) => {
    const startDate = new Date(schedule.start_day);
    return (startDate.getDay() + 6) % 7; // 월요일을 0으로 조정
  };

  // 일정의 지속 기간(일) 구하기
  const getDurationDays = (schedule: Schedule) => {
    const startDate = new Date(schedule.start_day);
    const endDate = new Date(schedule.end_day);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // 일정이 이번 주에 속하는지 확인
  const isScheduleInCurrentWeek = (schedule: Schedule) => {
    const today = new Date();
    const currentWeekMonday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    currentWeekMonday.setHours(0, 0, 0, 0);
    
    const currentWeekSunday = new Date(currentWeekMonday);
    currentWeekSunday.setDate(currentWeekMonday.getDate() + 6);
    currentWeekSunday.setHours(23, 59, 59, 999);
    
    const startDate = new Date(schedule.start_day);
    const endDate = new Date(schedule.end_day);
    
    return startDate <= currentWeekSunday && endDate >= currentWeekMonday;
  };
  
  const handleScheduleClick = (contractId: number) => {
    navigate(`/jobs/${contractId}`);
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.weekContainer}>
        <div className={styles.scheduleGrid}>
          {/* 요일 헤더 */}
          <div className={styles.headerRow}>
            {days.map((day, index) => (
              <div key={index} className={styles.dayHeader}>{day}</div>
            ))}
          </div>
          
          {/* 일정 영역 */}
          <div className={styles.scheduleRow}>
            {displayContracts
              .filter(schedule => schedule.status > 1)
              .filter(isScheduleInCurrentWeek)
              .map(schedule => {
                const startDayIndex = getStartDayIndex(schedule);
                const duration = getDurationDays(schedule);
                const style = {
                  gridColumn: `${startDayIndex + 1} / span ${Math.min(duration, 7 - startDayIndex)}`
                };
                
                return (
                  <button 
                    key={schedule.contract_id} 
                    className={`${styles.actionButton} ${
                      schedule.status === 2 ? styles.primaryButton :
                      schedule.status === 3 ? styles.secondaryButton :
                      styles.tertiaryButton
                    }`}
                    style={style}
                    onClick={() => handleScheduleClick(schedule.contract_id)}
                  >
                    {schedule.title}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar; 