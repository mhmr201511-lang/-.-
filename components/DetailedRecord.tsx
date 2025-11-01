import React, { useState, useEffect } from 'react';
import type { Student, YearGrades, PeriodGrades } from '../types';
import { GRADE_CATEGORIES, MAX_VALUES, calculateFinalScores } from '../utils/grades';
import { PrintIcon } from './Icons';

interface DetailedRecordProps {
  students: Student[];
  onSave: (studentId: string, updatedGrades: YearGrades) => void;
}

export const DetailedRecord: React.FC<DetailedRecordProps> = ({ students, onSave }) => {
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    // Create a deep copy to avoid mutating the original state directly
    setLocalStudents(JSON.parse(JSON.stringify(students)));
  }, [students]);

  const handleGradeChange = (
    studentId: string,
    term: 'semester1' | 'semester2',
    period: 'period1' | 'period2',
    field: keyof PeriodGrades,
    value: string
  ) => {
    const maxVal = MAX_VALUES[field];
    let numericValue = Number(value);
    
    if (value === '') {
      numericValue = 0;
    }
    
    if (isNaN(numericValue) || numericValue < 0 || numericValue > maxVal) {
      return; // Invalid input, do not update state
    }
    
    setLocalStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          // Create a deep copy of the student to update
          const updatedStudent = JSON.parse(JSON.stringify(student));
          updatedStudent.grades[term][period][field] = numericValue;
          return updatedStudent;
        }
        return student;
      })
    );
  };

  const handleSaveAll = () => {
    localStudents.forEach(student => {
      onSave(student.id, student.grades);
    });
    alert('تم حفظ جميع التعديلات بنجاح!');
  };

  const handlePrint = () => {
    window.print();
  };

  const sortedStudents = [...localStudents].sort((a, b) => a.name.localeCompare(b.name));
  const gradeKeys = Object.keys(GRADE_CATEGORIES) as (keyof PeriodGrades)[];
  
  const periods: {term: 'semester1' | 'semester2', period: 'period1' | 'period2', label: string}[] = [
      {term: 'semester1', period: 'period1', label: 'الفصل 1 - الفترة 1'},
      {term: 'semester1', period: 'period2', label: 'الفصل 1 - الفترة 2'},
      {term: 'semester2', period: 'period1', label: 'الفصل 2 - الفترة 1'},
      {term: 'semester2', period: 'period2', label: 'الفصل 2 - الفترة 2'},
  ];

  return (
    <div className="bg-white shadow-xl rounded-lg">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold text-gray-800">السجل التفصيلي (مع التعديل المباشر)</h2>
        <div className="flex gap-4">
          <button onClick={handleSaveAll} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">حفظ التعديلات</button>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700">
             <PrintIcon className="h-5 w-5" /> طباعة
          </button>
        </div>
      </div>
      <div id="print-area" className="overflow-x-auto p-6">
        <table className="min-w-full divide-y divide-gray-200 border text-xs">
          <thead className="bg-gray-50 text-center">
             <tr>
                <th rowSpan={2} className="px-2 py-2 border align-middle sticky left-0 bg-gray-50 z-20">اسم الطالب</th>
                {periods.map(p => (
                    <th key={p.label} colSpan={gradeKeys.length + 1} className="px-2 py-2 border font-medium text-gray-600 whitespace-nowrap">{p.label}</th>
                ))}
             </tr>
             <tr>
                {Array(4).fill(0).flatMap((_, periodIndex) => [
                    ...gradeKeys.map(key => (
                        <th key={`${periodIndex}-${key}`} className="px-2 py-2 border font-medium text-gray-500 whitespace-nowrap" title={GRADE_CATEGORIES[key].label}>
                            {GRADE_CATEGORIES[key].label.substring(0, 4)}
                        </th>
                    )),
                    <th key={`${periodIndex}-total`} className="px-2 py-2 border font-bold bg-blue-100 text-blue-800 whitespace-nowrap border-r-4 border-gray-300">المجموع</th>
                ])}
             </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map(student => {
              const periodTotals = periods.map(p => 
                calculateFinalScores(student.grades[p.term][p.period]).total.value
              );

              return (
              <tr key={student.id}>
                <td className="px-2 py-2 border font-medium whitespace-nowrap sticky left-0 bg-white z-10">{student.name}</td>
                {periods.flatMap((p, periodIndex) => [
                    ...gradeKeys.map(field => (
                      <td key={`${student.id}-${p.term}-${p.period}-${field}`} className="border p-0">
                        <input
                          type="number"
                          value={student.grades[p.term][p.period][field]}
                          onChange={e => handleGradeChange(student.id, p.term, p.period, field, e.target.value)}
                          className="w-12 text-center p-1 bg-transparent focus:bg-yellow-100 outline-none border-0"
                          min="0"
                          max={MAX_VALUES[field]}
                        />
                      </td>
                    )),
                    <td key={`${student.id}-${p.label}-total`} className="border p-1 text-center font-bold bg-blue-50 border-r-4 border-gray-300">
                        {periodTotals[periodIndex].toFixed(2)}
                    </td>
                ])}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};