import React, { useState, useEffect } from 'react';
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

// 현재 날짜부터 7일간의 날짜들을 얻기
const getNextSevenDays = () => {
  const today = new Date();
  
  const dates = [];
  const daysOfWeek = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
    
    const dayIndex = date.getDay(); // 0: 일요일, 1: 월요일, ...
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    daysOfWeek.push({
      day: dayNames[dayIndex],
      date: date.getDate(), // 날짜 (1-31)
      isToday: i === 0
    });
  }
  
  return { dates, daysOfWeek };
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ contracts = [] }) => {
  const navigate = useNavigate();
  const [weekInfo, setWeekInfo] = useState(getNextSevenDays());
  
  // 윈도우 크기가 변경될 때마다 새로 계산
  useEffect(() => {
    const handleResize = () => {
      setWeekInfo(getNextSevenDays());
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 일정의 시작 날짜 인덱스 구하기 (오늘 기준)
  const getStartDayIndex = (schedule: Schedule) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(schedule.startAt);
    startDate.setHours(0, 0, 0, 0);
    
    // 시작일이 오늘보다 전이면 0 반환
    if (startDate < today) {
      return 0;
    }
    
    // 시작일과 오늘 사이의 일수 계산
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // 일정의 지속 기간(일) 구하기
  const getDurationDays = (schedule: Schedule) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(schedule.startAt);
    startDate.setHours(0, 0, 0, 0);
    
    // 시작일이 오늘보다 전이면 시작일을 오늘로 조정
    const adjustedStartDate = startDate < today ? today : startDate;
    
    const endDate = new Date(schedule.endAt);
    endDate.setHours(23, 59, 59, 999);
    
    const diffTime = endDate.getTime() - adjustedStartDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 일정이 다음 7일에 속하는지 확인
  const isScheduleInNextSevenDays = (schedule: Schedule) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 6);
    nextWeek.setHours(23, 59, 59, 999);
    
    const startDate = new Date(schedule.startAt);
    const endDate = new Date(schedule.endAt);
    
    return startDate <= nextWeek && endDate >= today;
  };
  
  const handleScheduleClick = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.weekContainer}>
        <div className={styles.scheduleGrid}>
          {/* 요일 및 날짜 헤더 */}
          <div className={styles.headerRow}>
            {weekInfo.daysOfWeek.map((dayInfo, index) => (
              <div key={index} className={`${styles.dayHeader} ${dayInfo.isToday ? styles.today : ''}`}>
                <span className={styles.dayName}>{dayInfo.day}</span>
                <span className={styles.dayDate}>{dayInfo.date}</span>
              </div>
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
                .filter(isScheduleInNextSevenDays)
                .map(schedule => {
                  const startDayIndex = getStartDayIndex(schedule);
                  const duration = getDurationDays(schedule);
                  
                  // 7일을 넘어가는 일정은 표시 제한
                  const visibleDuration = Math.min(duration, 7 - startDayIndex);
                  
                  // 표시할 수 있는 일정인지 확인
                  if (startDayIndex >= 7 || visibleDuration <= 0) {
                    return null;
                  }
                  
                  const style = {
                    gridColumn: `${startDayIndex + 1} / span ${visibleDuration}`
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
                }).filter(Boolean) // null 값 제거
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar; 