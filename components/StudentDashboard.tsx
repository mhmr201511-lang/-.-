import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Student, PeriodGrades, YearGrades, Message, AttendanceRecord } from '../types';
import { UserIcon, PrintIcon, CertificateIcon } from './Icons';
import { calculateDisplayGrades, GRADE_CATEGORIES, MAX_VALUES, getMotivationalMessage, calculateRankings, getEarnedCertificates, calculateFinalScores } from '../utils/grades';
import { CertificateModal } from './CertificateModal';

interface StudentDashboardProps {
  student: Student;
  allStudents: Student[];
  onSendMessage: (text: string) => void;
  gradesVisibility: {
    semester1: { period1: boolean, period2: boolean },
    semester2: { period1: boolean, period2: boolean },
  };
  activeTerm: 'semester1' | 'semester2';
  activePeriod: 'period1' | 'period2';
}

const DetailedGrades: React.FC<{ grades: PeriodGrades, title: string, isVisible: boolean }> = ({ grades, title, isVisible }) => {
  if (!isVisible) {
    return (
       <div className="p-4 border rounded-lg bg-gray-50 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="text-center py-4 flex-grow flex items-center justify-center">
            <p className="text-gray-600 font-medium">الدرجات محجوبة حالياً من قبل المعلم.</p>
        </div>
       </div>
    )
  }
  
  const displayGrades = calculateDisplayGrades(grades);
  const scores = calculateFinalScores(grades);

  const gradeItems = (Object.keys(grades) as Array<keyof PeriodGrades>).map(key => {
    const category = GRADE_CATEGORIES[key];
    const displayGrade = displayGrades[key];
    const rawValue = grades[key];
    const maxRawValue = MAX_VALUES[key];

    return {
      label: category.label,
      performance: `${rawValue} / ${maxRawValue}`,
      calculated: `${displayGrade.value.toFixed(2)} / ${displayGrade.max}`,
    };
  });

  return (
    <div className="border rounded-lg bg-white flex flex-col h-full shadow">
      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">{title}</h3>
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">التقييم</th>
              <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">الأداء</th>
              <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">الدرجة</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gradeItems.map((item) => (
              <tr key={item.label} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.label}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{item.performance}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <span className="font-semibold text-blue-600">{item.calculated}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="mt-auto p-3 bg-gray-100 rounded-b-lg border-t">
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-600">المجموع: </span>
            <span className="text-lg font-bold text-blue-700">{scores.total.value.toFixed(2)} / 100</span>
          </div>
          <div className="text-center mt-2 text-sm text-blue-800 bg-blue-50 p-2 rounded-md">
            {getMotivationalMessage(scores.total.value)}
          </div>
        </div>
    </div>
  );
};

const MessagingSystem: React.FC<{ messages: Message[], onSendMessage: (text: string) => void }> = ({ messages = [], onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">التواصل مع المعلم</h3>
            <div className="bg-white border rounded-lg shadow p-4">
                <div className="h-64 overflow-y-auto pr-2 space-y-4 mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'student' ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        إرسال
                    </button>
                </form>
            </div>
        </div>
    );
};

const AttendanceStats: React.FC<{ attendance: AttendanceRecord[] }> = ({ attendance }) => {
  const stats = useMemo(() => {
    return (attendance || []).reduce(
      (acc, record) => {
        acc[record.status]++;
        return acc;
      },
      { present: 0, absent: 0, late: 0, excused: 0 }
    );
  }, [attendance]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">سجل الحضور</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">حصص الحضور</p>
          <p className="text-3xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">حصص الغياب</p>
          <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">حصص التأخر</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
        </div>
         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">حصص الاستئذان</p>
          <p className="text-3xl font-bold text-blue-600">{stats.excused}</p>
        </div>
      </div>
    </div>
  );
};


export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, allStudents, onSendMessage, gradesVisibility, activeTerm, activePeriod }) => {
  const [isCertificateModalOpen, setCertificateModalOpen] = useState(false);
  const { classRank, overallRank } = calculateRankings(student.id, allStudents);
  const earnedCertificates = getEarnedCertificates(student);
  
  const activePeriodGrades = student.grades[activeTerm][activePeriod];
  const activePeriodVisibility = gradesVisibility[activeTerm][activePeriod];
  const termLabel = activeTerm === 'semester1' ? 'الفصل الدراسي الأول' : 'الفصل الدراسي الثاني';
  const periodLabel = activePeriod === 'period1' ? 'الفترة الأولى' : 'الفترة الثانية';
  const activePeriodTitle = `${termLabel} - ${periodLabel}`;

  const handlePrint = () => {
    window.print();
  }

  return (
    <>
      <div className="px-4 py-6 sm:px-0">
        <div id="student-print-area" className="bg-white shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto">
          <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-right gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0">
                          <UserIcon className="w-12 h-12 text-blue-600" />
                      </div>
                      <div>
                          <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
                          <p className="text-lg text-gray-600 mt-1">{student.class}</p>
                      </div>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-2 no-print">
                      {earnedCertificates.length > 0 && (
                         <button onClick={() => setCertificateModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                          <CertificateIcon className="w-5 h-5" />
                          عرض شهادات التقدير
                       </button>
                      )}
                      <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          <PrintIcon className="w-5 h-5" />
                          طباعة التقرير
                      </button>
                   </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">الترتيب على الفصل</p>
                      <p className="text-2xl font-bold text-blue-600">{classRank}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">الترتيب العام</p>
                      <p className="text-2xl font-bold text-blue-600">{overallRank}</p>
                  </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تقييم الفترة النشطة</h2>
                  <div className="max-w-2xl mx-auto">
                      <DetailedGrades 
                          grades={activePeriodGrades} 
                          title={activePeriodTitle} 
                          isVisible={activePeriodVisibility} 
                      />
                  </div>
              </div>
              
              <AttendanceStats attendance={student.attendance} />
              <MessagingSystem messages={student.messages} onSendMessage={onSendMessage} />

          </div>
        </div>
      </div>
      {isCertificateModalOpen && (
        <CertificateModal
            isOpen={isCertificateModalOpen}
            onClose={() => setCertificateModalOpen(false)}
            studentName={student.name}
            certificates={earnedCertificates}
        />
      )}
    </>
  );
};