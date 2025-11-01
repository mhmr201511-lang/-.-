import React, { useState, useEffect, useMemo } from 'react';
import type { Student, AttendanceStatus } from '../types';

interface AttendanceManagementProps {
  students: Student[];
  onUpdateAttendance: (updates: { studentId: string; date: string; periodNumber: number; status: AttendanceStatus }[]) => void;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ students, onUpdateAttendance }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedClass, setSelectedClass] = useState<'ثالث متوسط 2' | 'ثالث متوسط 3'>('ثالث متوسط 3');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [attendance, setAttendance] = useState<{ [studentId: string]: AttendanceStatus }>({});

  const studentsInClass = useMemo(() => students.filter(s => s.class === selectedClass), [students, selectedClass]);

  useEffect(() => {
    const dailyAttendance: { [studentId: string]: AttendanceStatus } = {};
    studentsInClass.forEach(student => {
      const record = student.attendance?.find(rec => rec.date === selectedDate && rec.periodNumber === selectedPeriod);
      dailyAttendance[student.id] = record ? record.status : 'present'; // Default to present
    });
    setAttendance(dailyAttendance);
  }, [selectedDate, selectedClass, selectedPeriod, studentsInClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const updates = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      date: selectedDate,
      periodNumber: selectedPeriod,
      status,
    }));
    onUpdateAttendance(updates);
    alert(`تم حفظ الحضور والغياب للحصة ${selectedPeriod} ليوم ${selectedDate} بنجاح!`);
  };

  const statusOptions: { key: AttendanceStatus, label: string, color: string, activeColor: string }[] = [
    { key: 'present', label: 'حاضر', color: 'bg-gray-300 hover:bg-gray-400', activeColor: 'bg-green-500 hover:bg-green-600' },
    { key: 'absent', label: 'غائب', color: 'bg-gray-300 hover:bg-gray-400', activeColor: 'bg-red-500 hover:bg-red-600' },
    { key: 'late', label: 'متأخر', color: 'bg-gray-300 hover:bg-gray-400', activeColor: 'bg-yellow-500 hover:bg-yellow-600' },
    { key: 'excused', label: 'مستأذن', color: 'bg-gray-300 hover:bg-gray-400', activeColor: 'bg-blue-500 hover:bg-blue-600' },
  ];

  const classPeriods = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">تسجيل الحضور والغياب</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">اختر التاريخ</label>
          <input
            type="date"
            id="date-select"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="class-select-attendance" className="block text-sm font-medium text-gray-700">اختر الفصل</label>
          <select
            id="class-select-attendance"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value as any)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option>ثالث متوسط 3</option>
            <option>ثالث متوسط 2</option>
          </select>
        </div>
        <div>
          <label htmlFor="period-select-attendance" className="block text-sm font-medium text-gray-700">اختر الحصة</label>
          <select
            id="period-select-attendance"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {classPeriods.map(p => <option key={p} value={p}>الحصة {p}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[50vh] pr-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الطالب</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentsInClass.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {statusOptions.map(option => (
                      <button
                        key={option.key}
                        onClick={() => handleStatusChange(student.id, option.key)}
                        className={`px-3 py-1 text-sm text-white rounded-md transition-all ${
                          attendance[student.id] === option.key ? `${option.activeColor} ring-2 ring-offset-1 ring-blue-500` : option.color
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={handleSave}
          className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          حفظ حضور الحصة
        </button>
      </div>
    </div>
  );
};
