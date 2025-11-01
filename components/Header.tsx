import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { LogoutIcon, CalendarIcon, ClockIcon } from './Icons';

type User = { role: 'teacher' } | { role: 'student', id: string };

interface HeaderProps {
  user: User;
  student: Student | null;
  onLogout: () => void;
}

const LiveDateTime: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA-u-nu-latn', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex items-center gap-4 text-sm text-gray-200">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        <span>{formatDate(dateTime)}</span>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className="h-5 w-5" />
        <span>{formatTime(dateTime)}</span>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ user, student, onLogout }) => {
  const welcomeMessage = user.role === 'teacher' ? 'مرحباً بك' : `أهلاً بك يا ${student?.name}`;

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg text-white no-print">
      <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              سجل متابعة الطلاب
            </h1>
            <p className="text-sm text-gray-300 mt-1">الأستاذ: محمد الحربي | {welcomeMessage}</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
             <LiveDateTime />
             <button
                onClick={onLogout}
                className="w-full md:w-auto inline-flex items-center gap-2 justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
              >
                <LogoutIcon className="h-5 w-5" />
                <span className="hidden md:inline">تسجيل الخروج</span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};