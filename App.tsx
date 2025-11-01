import React, { useState, useMemo, useEffect } from 'react';
import type { Student, PeriodGrades, SemesterGrades, YearGrades, Message, AttendanceStatus, AttendanceRecord } from './types';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { calculateFinalScores } from './utils/grades';

const initialPeriodGrades: PeriodGrades = {
  research1: 0,
  research2: 0,
  participation: 0,
  homework: 0,
  memorization1: 0,
  memorization2: 0,
  recitation1: 0,
  recitation2: 0,
  recitation3: 0,
  hadith1: 0,
  hadith2: 0,
  exam1: 0,
  exam2: 0,
};

const initialSemesterGrades: SemesterGrades = {
  period1: JSON.parse(JSON.stringify(initialPeriodGrades)),
  period2: JSON.parse(JSON.stringify(initialPeriodGrades)),
};

const initialYearGrades: YearGrades = {
  semester1: JSON.parse(JSON.stringify(initialSemesterGrades)),
  semester2: JSON.parse(JSON.stringify(initialSemesterGrades)),
};

const INITIAL_STUDENTS: Student[] = [
  // فصل ثالث متوسط 3
  { id: 's01', name: 'حازم عبدالله علي البلادي', nationalId: '3616', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's02', name: 'حسن عبدالله مبارك الحربي', nationalId: '4586', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's03', name: 'حمدان تركي حمدان السراني', nationalId: '9093', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's04', name: 'خالد محمد الحربي', nationalId: '7816', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's05', name: 'عبدالاله ايمن الخناني', nationalId: '1471', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's06', name: 'عبدالعزيز محمد الامين', nationalId: '5575', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's07', name: 'عبدالمجيد غلاب الرشيدي', nationalId: '6070', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's08', name: 'عبدالملك خالد الاحمدي', nationalId: '7791', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's09', name: 'عبيد عبدالله العمري', nationalId: '7792', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's10', name: 'عزام مورق العتيبي', nationalId: '3261', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's11', name: 'عمر هشام الاحمدي', nationalId: '5876', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's12', name: 'عيد رائد العنزي', nationalId: '7202', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's13', name: 'محمد تركي المعيرفي', nationalId: '8989', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's14', name: 'محمد حامد العوفي', nationalId: '5569', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's15', name: 'محمد رامي قرطلي', nationalId: '0041', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's16', name: 'محمد شاهين الشاهين', nationalId: '2704', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's17', name: 'محمد شجاع الحربي', nationalId: '5218', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's18', name: 'محمد عساف البدراني', nationalId: '4465', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's19', name: 'محمد علي الشمراني', nationalId: '3908', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's20', name: 'محمد فهد الحربي', nationalId: '8215', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's21', name: 'معاذ حمدي الصاعدي', nationalId: '4835', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's22', name: 'نادر سلطان المطيري', nationalId: '1172', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's23', name: 'هاشم ماجد الجابري', nationalId: '0775', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's24', name: 'هشام هاني الصاعدي', nationalId: '4210', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's25', name: 'وليد حاتم المغذوي', nationalId: '0552', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's26', name: 'وليد محمد كدوان', nationalId: '0520', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's27', name: 'وليد مشاري الاحمدي', nationalId: '2558', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's28', name: 'يزيد احمد السالمي', nationalId: '1710', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's29', name: 'يوسف راكان جمال', nationalId: '9382', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's60', name: 'اصيل بدر الصبحي', nationalId: '8943', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's61', name: 'احمد سلطان الحربي', nationalId: '2466', class: 'ثالث متوسط 3', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },

  // فصل ثالث متوسط 2
  { id: 's30', name: 'اديب علاء الدين البكري', nationalId: '4211', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's31', name: 'اسامه عبدالله الحربي', nationalId: '7115', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's32', name: 'البراء محمد الحمد', nationalId: '2869', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's33', name: 'بدر محمد السنوسي', nationalId: '0347', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's34', name: 'حاتم خالد العمري الحربي', nationalId: '6788', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's35', name: 'حسن احمد العصاري', nationalId: '8835', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's36', name: 'حسن اشرف المدني', nationalId: '8436', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's37', name: 'حسين اشرف المدني', nationalId: '8402', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's38', name: 'خالد عبدالله الاسمري', nationalId: '2924', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's39', name: 'رائد عبدالرحمن العوفي', nationalId: '5493', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's40', name: 'زياد سلطان الحربي', nationalId: '6945', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's41', name: 'عبدالعزيز ماجد الحربي', nationalId: '7342', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's42', name: 'عبدالله ابراهيم فلاته', nationalId: '4471', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's43', name: 'عبدالمحسن خالد الاحمدي', nationalId: '1620', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's44', name: 'عدي عبدالهادي الرشيدي', nationalId: '0331', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's45', name: 'عزام عمر الرويثي', nationalId: '3399', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's46', name: 'عمار محمد الردادي', nationalId: '0453', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's47', name: 'عمر حسين حافظ', nationalId: '7151', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's48', name: 'عمر عادل الحربي', nationalId: '6420', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's49', name: 'عمر عبدالله فاطم الحربي', nationalId: '8873', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's50', name: 'فهد غويزي الحربي', nationalId: '0838', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's51', name: 'فيصل باسم المغامسي', nationalId: '9552', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's52', name: 'فيصل عبدالرحمن المولد', nationalId: '9354', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's53', name: 'فيصل فهد مظهر', nationalId: '3294', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's54', name: 'مالك صلاح النخلي', nationalId: '8507', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's55', name: 'مجتبى احمد العصاري', nationalId: '0250', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's56', name: 'محمد عيد المعاش', nationalId: '1545', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's57', name: 'معتز عبدالعزيز الرشيدي', nationalId: '4042', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's58', name: 'هاشم هتان نجدي', nationalId: '3640', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
  { id: 's59', name: 'يوسف بسام الصعفاني', nationalId: '0767', class: 'ثالث متوسط 2', grades: JSON.parse(JSON.stringify(initialYearGrades)), phone: '', messages: [], attendance: [] },
];

const TEACHER_CODE = 'm2015';

type User = { role: 'teacher' } | { role: 'student', id: string };

function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('مرحباً بكم في سجل متابعة الطلاب، تابعوا إعلاناتكم وواجباتكم هنا.');

  const [activeTerm, setActiveTerm] = useState<'semester1' | 'semester2'>(() => {
    return (localStorage.getItem('activeTerm') as 'semester1' | 'semester2') || 'semester1';
  });
  const [activePeriod, setActivePeriod] = useState<'period1' | 'period2'>(() => {
    return (localStorage.getItem('activePeriod') as 'period1' | 'period2') || 'period1';
  });
  
  useEffect(() => {
    localStorage.setItem('activeTerm', activeTerm);
  }, [activeTerm]);

  useEffect(() => {
    localStorage.setItem('activePeriod', activePeriod);
  }, [activePeriod]);


  const [gradesVisibility, setGradesVisibility] = useState({
    semester1: { period1: true, period2: true },
    semester2: { period1: true, period2: true },
  });

  const topStudentsByPeriod = useMemo(() => {
    const periods = [
        { term: 'semester1', period: 'period1' },
        { term: 'semester1', period: 'period2' },
        { term: 'semester2', period: 'period1' },
        { term: 'semester2', period: 'period2' },
    ];

    const allTopStudents: { [key: string]: { name: string, score: number }[] } = {};

    periods.forEach(({ term, period }) => {
        const studentsWithScores = students.map(student => {
            const periodGrades = student.grades[term as 'semester1' | 'semester2'][period as 'period1' | 'period2'];
            const totalScore = calculateFinalScores(periodGrades).total.value;
            return { name: student.name, score: totalScore };
        }).filter(s => s.score > 0);
        
        const top3 = studentsWithScores.sort((a, b) => b.score - a.score).slice(0, 3);
        allTopStudents[`${term}-${period}`] = top3;
    });

    return allTopStudents;
}, [students]);

  const handleLogin = (role: 'teacher' | 'student', code: string) => {
    setLoginError(null);
    if (role === 'teacher') {
      if (code === TEACHER_CODE) {
        setUser({ role: 'teacher' });
      } else {
        setLoginError('الرمز الخاص بالمعلم غير صحيح.');
      }
    } else {
      if (code.length !== 4 || !/^\d{4}$/.test(code)) {
        setLoginError('يرجى إدخال آخر 4 أرقام من الهوية.');
        return;
      }
      const student = students.find(s => s.nationalId === code);
      if (student) {
        setUser({ role: 'student', id: student.id });
      } else {
        setLoginError('الطالب غير موجود. يرجى التحقق من آخر 4 أرقام من الهوية.');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddStudent = (student: Omit<Student, 'id' | 'grades' | 'messages' | 'attendance'>) => {
    const newStudent: Student = { ...student, id: Date.now().toString(), grades: JSON.parse(JSON.stringify(initialYearGrades)), messages: [], attendance: [] };
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Omit<Student, 'grades' | 'messages' | 'attendance'>) => {
     setStudents(prev => prev.map(s => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s));
  };
  
  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };
  
  const handleBulkUpdateGrades = (updates: { studentId: string, field: keyof PeriodGrades, value: number }[]) => {
      setStudents(prevStudents => {
        const studentsById = new Map(prevStudents.map(s => [s.id, JSON.parse(JSON.stringify(s))])); // Deep copy
        updates.forEach(update => {
          const student = studentsById.get(update.studentId);
          if (student) {
            student.grades[activeTerm][activePeriod][update.field] = update.value;
            studentsById.set(student.id, student);
          }
        });
        return Array.from(studentsById.values());
      });
    };
  
  const handleDetailedRecordUpdate = (studentId: string, updatedGrades: YearGrades) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, grades: updatedGrades } : s));
  };

  const handleSendMessage = (studentId: string, text: string, sender: 'teacher' | 'student') => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const newMessage: Message = { text, sender, timestamp: Date.now() };
          const updatedMessages = s.messages ? [...s.messages, newMessage] : [newMessage];
          return { ...s, messages: updatedMessages };
        }
        return s;
      })
    );
  };

  const handleArchiveData = () => {
    try {
      const dataStr = JSON.stringify(students, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `student_data_archive_${new Date().toISOString().slice(0,10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Failed to archive data:", error);
      alert("حدث خطأ أثناء أرشفة البيانات.");
    }
  };

  const handleLoadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const loadedStudents = JSON.parse(e.target?.result as string);
          if (Array.isArray(loadedStudents) && loadedStudents.every(s => 'id' in s && 'name' in s && 'grades' in s)) {
            setStudents(loadedStudents);
            alert("تم تحميل البيانات بنجاح!");
          } else {
            throw new Error("Invalid file format.");
          }
        } catch (error) {
          console.error("Failed to load data:", error);
          alert("فشل تحميل البيانات. الرجاء التأكد من أن الملف صحيح.");
        }
      };
    }
  };

  const handleResetGrades = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة رصد جميع الدرجات؟ سيتم حذف جميع الدرجات المسجلة لجميع الطلاب.")) {
      setStudents(prevStudents => 
        prevStudents.map(student => ({
          ...student,
          grades: JSON.parse(JSON.stringify(initialYearGrades))
        }))
      );
      alert("تمت إعادة تعيين جميع الدرجات بنجاح.");
    }
  };

  const handleUpdateAttendance = (updates: { studentId: string; date: string; periodNumber: number; status: AttendanceStatus }[]) => {
    setStudents(prevStudents => {
      const newStudents = JSON.parse(JSON.stringify(prevStudents)); // Deep copy
      updates.forEach(update => {
        const student = newStudents.find((s: Student) => s.id === update.studentId);
        if (student) {
          // Remove any existing record for this date and period number
          student.attendance = student.attendance.filter((rec: AttendanceRecord) => !(rec.date === update.date && rec.periodNumber === update.periodNumber));
          // Add the new record
          student.attendance.push({ date: update.date, periodNumber: update.periodNumber, status: update.status });
        }
      });
      return newStudents;
    });
  };

  const handleChangePin = (studentId: string, newPin: string) => {
    setStudents(prev => 
      prev.map(s => 
        s.id === studentId ? { ...s, nationalId: newPin } : s
      )
    );
    alert("تم تغيير رمز دخول الطالب بنجاح.");
  };

  const loggedInStudent = user?.role === 'student' ? students.find(s => s.id === user.id) : null;

  if (!user) {
    return <Login 
        onLogin={handleLogin} 
        error={loginError} 
        announcement={announcement} 
        topStudentsByPeriod={topStudentsByPeriod}
      />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header user={user} student={loggedInStudent} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user.role === 'teacher' ? (
          <TeacherDashboard
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onBulkUpdateGrades={handleBulkUpdateGrades}
            onDetailedRecordUpdate={handleDetailedRecordUpdate}
            announcement={announcement}
            setAnnouncement={setAnnouncement}
            onSendMessage={handleSendMessage}
            activeTerm={activeTerm}
            setActiveTerm={setActiveTerm}
            activePeriod={activePeriod}
            setActivePeriod={setActivePeriod}
            gradesVisibility={gradesVisibility}
            setGradesVisibility={setGradesVisibility}
            onArchiveData={handleArchiveData}
            onLoadData={handleLoadData}
            onResetGrades={handleResetGrades}
            onUpdateAttendance={handleUpdateAttendance}
            onChangePin={handleChangePin}
          />
        ) : (
          loggedInStudent && <StudentDashboard 
            student={loggedInStudent} 
            allStudents={students}
            onSendMessage={(text) => handleSendMessage(loggedInStudent.id, text, 'student')}
            gradesVisibility={gradesVisibility}
            activeTerm={activeTerm}
            activePeriod={activePeriod}
          />
        )}
      </main>
    </div>
  );
}

export default App;