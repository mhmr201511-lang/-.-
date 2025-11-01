export interface PeriodGrades {
  research1: number; // raw score out of 5
  research2: number; // raw score out of 5
  participation: number; // raw score out of 20
  homework: number; // count, max 28
  memorization1: number; // raw score out of 5
  memorization2: number; // raw score out of 5
  recitation1: number; // raw score out of 5
  recitation2: number; // raw score out of 5
  recitation3: number; // raw score out of 5
  hadith1: number; // raw score out of 3
  hadith2: number; // raw score out of 2
  exam1: number; // raw score out of 15
  exam2: number; // raw score out of 15
}

export interface SemesterGrades {
  period1: PeriodGrades;
  period2: PeriodGrades;
}

export interface YearGrades {
  semester1: SemesterGrades;
  semester2: SemesterGrades;
}

export interface Message {
  text: string;
  sender: 'teacher' | 'student';
  timestamp: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  periodNumber: number; // 1-7 for class period
  status: AttendanceStatus;
}

export interface Student {
  id: string;
  name: string;
  nationalId: string; // 4 digits
  class: 'ثالث متوسط 2' | 'ثالث متوسط 3';
  phone?: string;
  grades: YearGrades;
  messages: Message[];
  attendance: AttendanceRecord[];
}