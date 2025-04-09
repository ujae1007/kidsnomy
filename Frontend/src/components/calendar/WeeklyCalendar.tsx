import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WeeklyCalendar.module.css';

interface Schedule {
  id: number;
  groupId: number;
  employerId: number;
  employeeId: number | null;
  title: string;
  content: string;
  salary: number;
  isPermanent: boolean;
  rewardText: string;
  status: number;
  startAt: string;
  endAt: string;
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

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ contracts = [] }) => {
  const navigate = useNavigate();
  
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  // 일정의 시작 요일 인덱스 구하기
  const getStartDayIndex = (schedule: Schedule) => {
    const startDate = new Date(schedule.startAt);
    return (startDate.getDay() + 6) % 7; // 월요일을 0으로 조정
  };

  // 일정의 지속 기간(일) 구하기
  const getDurationDays = (schedule: Schedule) => {
    const startDate = new Date(schedule.startAt);
    const endDate = new Date(schedule.endAt);
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
    
    const startDate = new Date(schedule.startAt);
    const endDate = new Date(schedule.endAt);
    
    return startDate <= currentWeekSunday && endDate >= currentWeekMonday;
  };
  
  const handleScheduleClick = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
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
            {contracts.length === 0 ? (
              <div className={styles.noSchedule}>
                일정이 없습니다
              </div>
            ) : (
              contracts
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
                      key={schedule.id} 
                      className={`${styles.actionButton} ${
                        schedule.status === 2 ? styles.primaryButton :
                        schedule.status === 3 ? styles.secondaryButton :
                        styles.tertiaryButton
                      }`}
                      style={style}
                      onClick={() => handleScheduleClick(schedule.id)}
                    >
                      {schedule.title}
                    </button>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar; 