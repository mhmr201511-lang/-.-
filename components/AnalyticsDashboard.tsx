import React, { useMemo } from 'react';
import type { Student } from '../types';
import { calculateOverallTotal, getGradeDistribution } from '../utils/grades';

interface GradeAnalysisProps {
  students: Student[];
}

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

export const AnalyticsDashboard: React.FC<GradeAnalysisProps> = ({ students }) => {

  const analysis = useMemo(() => {
    if (students.length === 0) {
      return {
        class2Avg: 0,
        class3Avg: 0,
        distribution: {},
        needsImprovement: []
      };
    }

    const class2Students = students.filter(s => s.class === 'ثالث متوسط 2');
    const class3Students = students.filter(s => s.class === 'ثالث متوسط 3');

    const calculateAverage = (studentList: Student[]) => {
      if (studentList.length === 0) return 0;
      const total = studentList.reduce((acc, s) => acc + calculateOverallTotal(s.grades).percentage, 0);
      return total / studentList.length;
    };
    
    const class2Avg = calculateAverage(class2Students);
    const class3Avg = calculateAverage(class3Students);

    const distribution = getGradeDistribution(students);

    const needsImprovement = students
      .map(s => ({ student: s, percentage: calculateOverallTotal(s.grades).percentage }))
      .filter(s => s.percentage < 60 && s.percentage > 0)
      .sort((a, b) => a.percentage - b.percentage);

    return { class2Avg, class3Avg, distribution, needsImprovement };
  }, [students]);

  const distributionEntries = Object.entries(analysis.distribution);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">تحليل الدرجات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="متوسط أداء فصل (2)" value={`${analysis.class2Avg.toFixed(2)}%`} />
        <StatCard title="متوسط أداء فصل (3)" value={`${analysis.class3Avg.toFixed(2)}%`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">توزيع التقديرات العام</h3>
        <div className="bg-gray-50 p-4 rounded-lg border">
          {distributionEntries.length > 0 ? (
            distributionEntries.map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between py-1">
                <span className="font-medium text-gray-600">{grade}</span>
                <span className="font-bold text-blue-600">{count} طالب</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">لا توجد بيانات كافية لعرض التوزيع.</p>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">الطلاب الأكثر حاجة للمتابعة</h3>
        <div className="bg-gray-50 p-4 rounded-lg border max-h-60 overflow-y-auto">
          {analysis.needsImprovement.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {analysis.needsImprovement.map(({ student, percentage }) => (
                <li key={student.id} className="flex items-center justify-between py-2">
                  <div>
                     <p className="font-medium text-gray-800">{student.name}</p>
                     <p className="text-sm text-gray-500">{student.class}</p>
                  </div>
                  <span className="text-red-600 font-bold">{percentage.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">لا يوجد طلاب يحتاجون للمتابعة حالياً.</p>
          )}
        </div>
      </div>

    </div>
  );
};
