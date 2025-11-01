import React from 'react';
import type { Student } from '../types';
import { calculateFinalScores, getGradeCategory, calculateOverallTotal } from '../utils/grades';
import { PrintIcon } from './Icons';

interface FinalRecordProps {
  students: Student[];
}

export const FinalRecord: React.FC<FinalRecordProps> = ({ students }) => {

  const handlePrint = () => {
    window.print();
  };

  const studentRecords = students.map(student => {
    const s1p1 = calculateFinalScores(student.grades.semester1.period1);
    const s1p2 = calculateFinalScores(student.grades.semester1.period2);
    const s2p1 = calculateFinalScores(student.grades.semester2.period1);
    const s2p2 = calculateFinalScores(student.grades.semester2.period2);
    
    const semester1Total = s1p1.total.value + s1p2.total.value;
    const semester2Total = s2p1.total.value + s2p2.total.value;

    const overall = calculateOverallTotal(student.grades);
    const grade = getGradeCategory(overall.percentage);

    return {
      ...student,
      s1p1, s1p2, s2p1, s2p2,
      semester1Total,
      semester2Total,
      grandTotal: overall.value,
      grade
    };
  }).sort((a,b) => a.name.localeCompare(b.name));

  return (
     <div className="bg-white shadow-xl rounded-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center no-print">
             <h2 className="text-2xl font-bold text-gray-800">السجل العام للدرجات</h2>
             <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <PrintIcon className="h-5 w-5" />
                <span>طباعة السجل</span>
              </button>
        </div>
        <div id="print-area">
            <div className="p-4 hidden print:block text-center">
                 <h1 className="text-xl font-bold">سجل متابعة الطلاب</h1>
                 <p className="text-sm">القران الكريم والدراسات الاسلامية</p>
            </div>
            
            {/* Semester 1 Table */}
            <div className="overflow-x-auto p-6">
                <h3 className="text-lg font-bold mb-2 text-center print:text-right">الفصل الدراسي الأول</h3>
                <table className="min-w-full divide-y divide-gray-200 border text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th rowSpan={2} className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase border align-middle">م</th>
                            <th rowSpan={2} className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase border align-middle">اسم الطالب</th>
                            <th colSpan={3} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border">الفترة الأولى</th>
                            <th colSpan={3} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border">الفترة الثانية</th>
                            <th rowSpan={2} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border align-middle bg-blue-50">مجموع الفصل (200)</th>
                        </tr>
                        <tr>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">أعمال (40)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">شفوي (60)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border bg-gray-100">مجموع</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">أعمال (40)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">شفوي (60)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border bg-gray-100">مجموع</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentRecords.map((r, index) => (
                            <tr key={r.id}>
                                <td className="px-2 py-2 whitespace-nowrap border text-center">{index + 1}</td>
                                <td className="px-2 py-2 whitespace-nowrap border font-medium">{r.name}</td>
                                <td className="px-1 py-2 border text-center">{r.s1p1.category1.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center">{r.s1p1.category2.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center font-semibold bg-gray-50">{r.s1p1.total.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center">{r.s1p2.category1.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center">{r.s1p2.category2.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center font-semibold bg-gray-50">{r.s1p2.total.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center font-bold bg-blue-50">{r.semester1Total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* Semester 2 Table */}
            <div className="overflow-x-auto p-6 pt-0">
                <h3 className="text-lg font-bold mb-2 text-center print:text-right">الفصل الدراسي الثاني والمجموع النهائي</h3>
                <table className="min-w-full divide-y divide-gray-200 border text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th rowSpan={2} className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase border align-middle">م</th>
                            <th rowSpan={2} className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase border align-middle">اسم الطالب</th>
                            <th colSpan={3} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border">الفترة الثالثة</th>
                            <th colSpan={3} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border">الفترة الرابعة</th>
                            <th rowSpan={2} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border align-middle bg-blue-50">مجموع الفصل (200)</th>
                            <th rowSpan={2} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border align-middle bg-green-50">المجموع النهائي (400)</th>
                            <th rowSpan={2} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border align-middle">التقدير</th>
                        </tr>
                        <tr>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">أعمال (40)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">شفوي (60)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border bg-gray-100">مجموع</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">أعمال (40)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border">شفوي (60)</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase border bg-gray-100">مجموع</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentRecords.map((r, index) => (
                            <tr key={r.id}>
                                <td className="px-2 py-2 whitespace-nowrap border text-center">{index + 1}</td>
                                <td className="px-2 py-2 whitespace-nowrap border font-medium">{r.name}</td>
                                <td className="px-1 py-2 border text-center">{r.s2p1.category1.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center">{r.s2p1.category2.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center font-semibold bg-gray-50">{r.s2p1.total.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center">{r.s2p2.category1.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center">{r.s2p2.category2.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center font-semibold bg-gray-50">{r.s2p2.total.value.toFixed(2)}</td>
                                <td className="px-1 py-2 border text-center font-bold bg-blue-50">{r.semester2Total.toFixed(2)}</td>
                                <td className="px-2 py-2 border text-center font-bold bg-green-50">{r.grandTotal.toFixed(2)}</td>
                                <td className="px-2 py-2 border text-center font-semibold">{r.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
     </div>
  );
};