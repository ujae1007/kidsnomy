import React, { useState, ReactNode } from 'react';

interface Contract {
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

interface CalendarProps {
  contracts: Contract[];
}

const Calendar: React.FC<CalendarProps> = ({ contracts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getContractsForDay = (day: number) => {
    return contracts.filter(contract => {
      const startDate = new Date(contract.start_day);
      const endDate = new Date(contract.end_day);
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      return currentDay >= startDate && currentDay <= endDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: ReactNode[] = [];

    // 이전 달의 날짜들
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const dayContracts = getContractsForDay(day);
      days.push(
        <div key={day} className="calendar-day">
          <span>{day}</span>
          {dayContracts.length > 0 && (
            <div className="contracts">
              {dayContracts.map(contract => (
                <div key={contract.contract_id} className="contract-item">
                  {contract.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="weekday">일</div>
        <div className="weekday">월</div>
        <div className="weekday">화</div>
        <div className="weekday">수</div>
        <div className="weekday">목</div>
        <div className="weekday">금</div>
        <div className="weekday">토</div>
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar; 