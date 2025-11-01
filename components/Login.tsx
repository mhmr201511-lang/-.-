import React, { useState, useEffect } from 'react';
import { UserIcon, KeyIcon, TrophyIcon } from './Icons';

type TopStudentsData = { [key: string]: { name: string, score: number }[] };

interface LoginProps {
  onLogin: (role: 'teacher' | 'student', code: string) => void;
  error: string | null;
  announcement: string;
  topStudentsByPeriod: TopStudentsData;
}

type Role = 'student' | 'teacher';

const Announcements: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm text-white py-2 overflow-hidden shadow-lg fixed top-0 w-full z-10">
      <div className="marquee">
        <span>{text}</span>
      </div>
    </div>
  );
};

const HonorBoard: React.FC<{ topStudentsByPeriod: TopStudentsData }> = ({ topStudentsByPeriod }) => {
  const periods = [
    { key: 'semester1-period1', label: 'الفصل 1 - فترة 1' },
    { key: 'semester1-period2', label: 'ف1 - فترة 2' },
    { key: 'semester2-period1', label: 'ف2 - فترة 1' },
    { key: 'semester2-period2', label: 'ف2 - فترة 2' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % periods.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, periods.length]);

  const selectedPeriodKey = periods[currentIndex].key;
  const selectedPeriodLabel = periods[currentIndex].label;
  const topStudents = topStudentsByPeriod[selectedPeriodKey] || [];

  return (
    <div className="p-6 h-full flex flex-col">
       <h3 className="text-center text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <TrophyIcon className="h-8 w-8 text-yellow-500" />
            <span>لوحة التميز والإبداع</span>
            <TrophyIcon className="h-8 w-8 text-yellow-500" />
       </h3>
       <div className="text-center font-semibold text-blue-700 mb-4">{selectedPeriodLabel}</div>
       <div className="flex-grow flex items-center justify-center slide-item" key={currentIndex}>
        {topStudents.length > 0 ? (
          <ul className="space-y-3 w-full">
            {topStudents.map((student, index) => (
               <li key={index} className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200 shadow-sm">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                  index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                }`}>
                  {index + 1}
                </span>
                <span className="mr-4 font-semibold text-gray-800 text-lg">{student.name}</span>
                <span className="ml-auto text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{student.score.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            <TrophyIcon className="h-16 w-16 mx-auto text-gray-300" />
            <p className="mt-2">لم يتم رصد كامل الدرجات.</p>
          </div>
        )}
       </div>
       <div className="flex justify-center mt-4 space-x-2 space-x-reverse">
          {periods.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
    </div>
  );
};


export const Login: React.FC<LoginProps> = ({ onLogin, error, announcement, topStudentsByPeriod }) => {
  const [role, setRole] = useState<Role>('student');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, code);
  };
  
  const isTeacher = role === 'teacher';

  return (
    <div className="min-h-screen flex flex-col">
       <Announcements text={announcement} />
       <div className="flex-grow flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-wider">
                سجل متابعة الطلاب
                </h1>
                <p className="mt-2 text-2xl text-gray-700">
                للأستاذ محمد الحربي
                </p>
            </div>
    
            <div className="w-full sm:max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="bg-white/70 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 order-2 md:order-1 border border-white/30">
                  <div className="mb-6">
                      <div className="flex bg-gray-200/50 rounded-lg p-1">
                        <button
                          onClick={() => setRole('student')}
                          className={`w-1/2 py-2.5 text-md font-bold rounded-md transition-all duration-300 ${role === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                          دخول الطالب
                        </button>
                        <button
                          onClick={() => setRole('teacher')}
                          className={`w-1/2 py-2.5 text-md font-bold rounded-md transition-all duration-300 ${role === 'teacher' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                          دخول المعلم
                        </button>
                      </div>
                  </div>
    
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700 text-right">
                        {isTeacher ? 'الرمز الخاص' : 'آخر 4 أرقام من الهوية'}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {isTeacher ? <KeyIcon className="h-5 w-5 text-gray-400" /> : <UserIcon className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="code"
                          name="code"
                          type={isTeacher ? "password" : "text"}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                          maxLength={isTeacher ? undefined : 4}
                          className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                          placeholder={isTeacher ? 'أدخل الرمز الخاص بالمعلم' : 'مثال: 1234'}
                        />
                      </div>
                    </div>
    
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}
    
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        تسجيل الدخول
                      </button>
                    </div>
                  </form>
                </div>
                 <div className="order-1 md:order-2 bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/30">
                   <HonorBoard topStudentsByPeriod={topStudentsByPeriod} />
                 </div>
              </div>
            </div>
      </div>
    </div>
  );
};