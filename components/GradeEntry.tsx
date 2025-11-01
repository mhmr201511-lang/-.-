import React, { useState, useEffect } from 'react';
import type { Student, PeriodGrades } from '../types';
import { MAX_VALUES, GRADE_CATEGORIES } from '../utils/grades';

interface GradeEntryProps {
  students: Student[];
  onBulkUpdateGrades: (updates: { studentId: string, field: keyof PeriodGrades, value: number }[]) => void;
  activeTerm: 'semester1' | 'semester2';
  activePeriod: 'period1' | 'period2';
}

export const GradeEntry: React.FC<GradeEntryProps> = ({ students, onBulkUpdateGrades, activeTerm, activePeriod }) => {
  const [selectedClass, setSelectedClass] = useState<'ثالث متوسط 2' | 'ثالث متوسط 3'>('ثالث متوسط 3');
  const [selectedField, setSelectedField] = useState<keyof PeriodGrades>('homework');
  const [gradeUpdates, setGradeUpdates] = useState<{ [studentId: string]: number }>({});

  const studentsInClass = students.filter(s => s.class === selectedClass);
  
  useEffect(() => {
    // Reset local updates when class, field, term, or period changes
    const initialUpdates: { [studentId: string]: number } = {};
    studentsInClass.forEach(s => {
      initialUpdates[s.id] = s.grades[activeTerm][activePeriod][selectedField];
    });
    setGradeUpdates(initialUpdates);
  }, [selectedClass, selectedField, students, activeTerm, activePeriod]);


  const handleGradeChange = (studentId: string, value: string) => {
    const maxVal = MAX_VALUES[selectedField];
    let numericValue = Number(value);
    
    if (value === '') {
      numericValue = 0;
    }

    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxVal) {
      setGradeUpdates(prev => ({
        ...prev,
        [studentId]: numericValue
      }));
    }
  };

  const handleSave = () => {
    const updatesToSave = Object.entries(gradeUpdates).map(([studentId, value]) => ({
      studentId,
      field: selectedField,
      value
    }));
    onBulkUpdateGrades(updatesToSave);
    alert(`تم حفظ درجات ${GRADE_CATEGORIES[selectedField].label} للفترة النشطة بنجاح!`);
  };
  
  const currentCategory = GRADE_CATEGORIES[selectedField];
  const inputType = currentCategory.isCount ? 'عدد' : 'درجة';
  const maxLabel = `(الحد الأقصى: ${MAX_VALUES[selectedField]})`;
  const termLabel = activeTerm === 'semester1' ? 'الفصل الأول' : 'الفصل الثاني';
  const periodLabel = activePeriod === 'period1' ? 'الفترة الأولى' : 'الفترة الثانية';

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-gray-800">رصد الدرجات</h2>
        <div className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            الفترة النشطة: {termLabel} - {periodLabel}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">اختر الفصل</label>
            <select
                id="class-select"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value as any)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
                <option>ثالث متوسط 3</option>
                <option>ثالث متوسط 2</option>
            </select>
        </div>
        <div>
            <label htmlFor="field-select" className="block text-sm font-medium text-gray-700">اختر التقييم</label>
            <select
                id="field-select"
                value={selectedField}
                onChange={e => setSelectedField(e.target.value as keyof PeriodGrades)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
                {Object.entries(GRADE_CATEGORIES).map(([key, {label}]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[50vh] pr-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الطالب</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{inputType} {maxLabel}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentsInClass.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    max={MAX_VALUES[selectedField]}
                    value={gradeUpdates[student.id] ?? ''}
                    onChange={e => handleGradeChange(student.id, e.target.value)}
                    className="w-24 text-center p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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
          حفظ التقييمات
        </button>
      </div>
    </div>
  );
};