
import React, { useState } from 'react';
import { MONTH_NAMES_TH } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarProps {
    documentDates: string[];
}

const Calendar: React.FC<CalendarProps> = ({ documentDates }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const docDaysInMonth = new Set(
        documentDates
            .map(d => new Date(d))
            .filter(d => d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth())
            .map(d => d.getDate())
    );

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === today.getDate();
            const hasDoc = docDaysInMonth.has(day);

            let dayClass = 'w-8 h-8 flex items-center justify-center rounded-full text-sm ';
            if (isToday) {
                dayClass += 'bg-blue-500 text-white font-bold ';
            } else if (hasDoc) {
                dayClass += 'bg-yellow-400 text-black font-bold ';
            }

            days.push(
                <div key={day} className={dayClass}>
                    {day}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-gray-800 p-3 rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-700"><ChevronLeftIcon className="w-5 h-5"/></button>
                <div className="font-bold text-sm">
                    {MONTH_NAMES_TH[currentDate.getMonth()]} {currentDate.getFullYear() + 543}
                </div>
                <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-700"><ChevronRightIcon className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
                <div>อา</div><div>จ</div><div>อ</div><div>พ</div><div>พฤ</div><div>ศ</div><div>ส</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {renderDays()}
            </div>
            <div className="mt-2 text-xs flex items-center space-x-4 justify-center">
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>มีเอกสาร</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>วันนี้</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
