import React from 'react';
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
  // 나중에 일정 데이터를 받아올 props 추가 예정
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = () => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  // 더미 데이터
  const dummySchedules: Schedule[] = [
    {
      user_id: 1,
      user_name: "홍길동",
      start_day: new Date().toISOString(),
      end_day: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      title: "문안인사드리기",
      content: "행사 포스터 제작",
      salary: 50000,
      is_permanent: false,
      reward_text: "추가 보너스 지급 가능",
      status: 2,
      contract_id: 2,
      contractor_name: "김철수"
    },
    {
      user_id: 2,
      user_name: "이영희",
      start_day: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      end_day: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      title: "백덤블링 하기",
      content: "버그 수정 및 기능 개선",
      salary: 80000,
      is_permanent: true,
      reward_text: "장기 계약 가능",
      status: 2,
      contract_id: 3,
      contractor_name: "박지민"
    },
    {
      user_id: 3,
      user_name: "김민수",
      start_day: new Date().toISOString(),
      end_day: new Date().toISOString(),
      title: "설거지",
      content: "신규 브랜드 로고 제작",
      salary: 30000,
      is_permanent: false,
      reward_text: "",
      status: 3,
      contract_id: 4,
      contractor_name: "최수진"
    }
  ];

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
            {dummySchedules
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