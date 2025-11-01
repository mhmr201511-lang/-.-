import type { PeriodGrades, YearGrades, Student } from '../types';

export const MAX_VALUES: { [key in keyof PeriodGrades]: number } = {
  research1: 5,
  research2: 5,
  participation: 20,
  homework: 28,
  memorization1: 5,
  memorization2: 5,
  recitation1: 5,
  recitation2: 5,
  recitation3: 5,
  hadith1: 3,
  hadith2: 2,
  exam1: 15,
  exam2: 15,
};

export const GRADE_CATEGORIES: { [key in keyof PeriodGrades]: { label: string, max: number, isCount?: boolean } } = {
  research1: { label: 'البحث 1', max: 5 },
  research2: { label: 'البحث 2', max: 5 },
  participation: { label: 'المشاركة', max: 20 },
  homework: { label: 'الواجبات', max: 10, isCount: true },
  memorization1: { label: 'الحفظ 1', max: 5 },
  memorization2: { label: 'الحفظ 2', max: 5 },
  recitation1: { label: 'التلاوة 1', max: 5 },
  recitation2: { label: 'التلاوة 2', max: 5 },
  recitation3: { label: 'التلاوة 3', max: 5 },
  hadith1: { label: 'الحديث 1', max: 3 },
  hadith2: { label: 'الحديث 2', max: 2 },
  exam1: { label: 'اختبار 1', max: 15 },
  exam2: { label: 'اختبار 2', max: 15 },
};

export function calculateDisplayGrades(rawGrades: PeriodGrades) {
  const safeDiv = (num: number, den: number) => (den === 0 ? 0 : num / den);

  return {
    research1: { value: rawGrades.research1, max: GRADE_CATEGORIES.research1.max },
    research2: { value: rawGrades.research2, max: GRADE_CATEGORIES.research2.max },
    participation: { value: rawGrades.participation, max: GRADE_CATEGORIES.participation.max },
    homework: {
      value: safeDiv(rawGrades.homework, MAX_VALUES.homework) * GRADE_CATEGORIES.homework.max,
      max: GRADE_CATEGORIES.homework.max,
    },
    memorization1: { value: rawGrades.memorization1, max: GRADE_CATEGORIES.memorization1.max },
    memorization2: { value: rawGrades.memorization2, max: GRADE_CATEGORIES.memorization2.max },
    recitation1: { value: rawGrades.recitation1, max: GRADE_CATEGORIES.recitation1.max },
    recitation2: { value: rawGrades.recitation2, max: GRADE_CATEGORIES.recitation2.max },
    recitation3: { value: rawGrades.recitation3, max: GRADE_CATEGORIES.recitation3.max },
    hadith1: { value: rawGrades.hadith1, max: GRADE_CATEGORIES.hadith1.max },
    hadith2: { value: rawGrades.hadith2, max: GRADE_CATEGORIES.hadith2.max },
    exam1: { value: rawGrades.exam1, max: GRADE_CATEGORIES.exam1.max },
    exam2: { value: rawGrades.exam2, max: GRADE_CATEGORIES.exam2.max },
  };
}

export function calculateFinalScores(rawGrades: PeriodGrades) {
  if (!rawGrades) { // Safety check
    return {
      category1: { value: 0, max: 40 },
      category2: { value: 0, max: 60 },
      exams: { value: 0, max: 30 },
      total: { value: 0, max: 100 }
    };
  }
  const displayGrades = calculateDisplayGrades(rawGrades);
  
  const category1Raw = displayGrades.research1.value + displayGrades.research2.value + displayGrades.participation.value + displayGrades.homework.value;
  const category1Max = GRADE_CATEGORIES.research1.max + GRADE_CATEGORIES.research2.max + GRADE_CATEGORIES.participation.max + GRADE_CATEGORIES.homework.max;
  const category1Final = category1Max === 0 ? 0 : (category1Raw / category1Max) * 40;

  const category2Raw = displayGrades.memorization1.value + displayGrades.memorization2.value + displayGrades.recitation1.value + displayGrades.recitation2.value + displayGrades.recitation3.value + displayGrades.hadith1.value + displayGrades.hadith2.value;
  const category2Max = GRADE_CATEGORIES.memorization1.max + GRADE_CATEGORIES.memorization2.max + GRADE_CATEGORIES.recitation1.max + GRADE_CATEGORIES.recitation2.max + GRADE_CATEGORIES.recitation3.max + GRADE_CATEGORIES.hadith1.max + GRADE_CATEGORIES.hadith2.max;
  const category2Final = category2Max === 0 ? 0 : (category2Raw / category2Max) * 60;

  const examsTotal = displayGrades.exam1.value + displayGrades.exam2.value;

  const totalScore = category1Final + category2Final;

  return {
    category1: { value: category1Final, max: 40 },
    category2: { value: category2Final, max: 60 },
    exams: { value: examsTotal, max: 30 },
    total: { value: totalScore, max: 100 }
  };
}

export function calculateOverallTotal(yearGrades: YearGrades) {
  const s1p1 = calculateFinalScores(yearGrades.semester1.period1).total.value;
  const s1p2 = calculateFinalScores(yearGrades.semester1.period2).total.value;
  const s2p1 = calculateFinalScores(yearGrades.semester2.period1).total.value;
  const s2p2 = calculateFinalScores(yearGrades.semester2.period2).total.value;
  const grandTotal = s1p1 + s1p2 + s2p1 + s2p2;
  const percentage = grandTotal > 0 ? (grandTotal / 400) * 100 : 0;
  return { value: grandTotal, max: 400, percentage: percentage };
}

export function getGradeCategory(percentage: number): string {
  if (percentage >= 90) return 'ممتاز';
  if (percentage >= 80) return 'جيد جداً';
  if (percentage >= 70) return 'جيد';
  if (percentage >= 60) return 'مقبول';
  if (percentage > 0) return 'يحتاج تحسين';
  return '-';
}

export function getMotivationalMessage(percentage: number): string {
  if (percentage >= 95) return 'أداء استثنائي! أنت نجم حقيقي، استمر في هذا التألق.';
  if (percentage >= 90) return 'ممتاز! عمل رائع ومجهود يستحق الثناء، واصل إبداعك.';
  if (percentage >= 85) return 'جيد جداً! أنت على الطريق الصحيح لتحقيق التميز، خطوة أخرى وتصل للقمة.';
  if (percentage >= 80) return 'مستوى جيد جداً، لديك القدرة على تحقيق المزيد من التقدم.';
  if (percentage >= 75) return 'جيد! أداؤك في تطور ملحوظ، استمر في المذاكرة والمشاركة.';
  if (percentage >= 70) return 'مستوى جيد، حافظ على هذا الأداء مع التركيز على نقاط الضعف.';
  if (percentage >= 60) return 'مقبول. يمكنك تحقيق أفضل من ذلك بالمزيد من الجهد والمثابرة.';
  if (percentage > 0) return 'يحتاج إلى تحسين. أعلم أن لديك القدرة، لا تتردد في طلب المساعدة.';
  return 'لم يتم رصد درجات كافية لعرض رسالة تحفيزية.';
}


export function calculateRankings(studentId: string, allStudents: Student[]) {
  const overall = calculateOverallTotal(allStudents.find(s => s.id === studentId)!.grades);
  
  const studentsWithScores = allStudents.map(s => ({
    id: s.id,
    class: s.class,
    score: calculateOverallTotal(s.grades).value
  }));

  // Overall Rank
  studentsWithScores.sort((a, b) => b.score - a.score);
  const overallRank = studentsWithScores.findIndex(s => s.id === studentId) + 1;

  // Class Rank
  const student = allStudents.find(s => s.id === studentId);
  const classStudents = studentsWithScores.filter(s => s.class === student?.class);
  const classRank = classStudents.findIndex(s => s.id === studentId) + 1;

  return {
    classRank: classRank > 0 ? classRank : '-',
    overallRank: overallRank > 0 ? overallRank : '-',
    overallPercentage: overall.percentage,
  };
}

export function getGradeDistribution(students: Student[]) {
  const distribution: { [key: string]: number } = { 'ممتاز': 0, 'جيد جداً': 0, 'جيد': 0, 'مقبول': 0, 'يحتاج تحسين': 0 };
  students.forEach(student => {
    const overall = calculateOverallTotal(student.grades);
    if(overall.value > 0){
        const grade = getGradeCategory(overall.percentage);
        distribution[grade]++;
    }
  });
  return distribution;
}

export const getEarnedCertificates = (student: Student) => {
    const certificates: { periodName: string; score: number }[] = [];
    const periods = [
        { name: 'الفصل الدراسي الأول - الفترة الأولى', grades: student.grades.semester1.period1 },
        { name: 'الفصل الدراسي الأول - الفترة الثانية', grades: student.grades.semester1.period2 },
        { name: 'الفصل الدراسي الثاني - الفترة الأولى', grades: student.grades.semester2.period1 },
        { name: 'الفصل الدراسي الثاني - الفترة الثانية', grades: student.grades.semester2.period2 },
    ];

    periods.forEach(p => {
        const total = calculateFinalScores(p.grades).total.value;
        if (total >= 90) {
            certificates.push({ periodName: p.name, score: total });
        }
    });
    return certificates;
};