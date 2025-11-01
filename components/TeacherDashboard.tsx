import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Student, PeriodGrades, YearGrades, Message, AttendanceStatus, AttendanceRecord } from '../types';
import { StudentTable } from './StudentTable';
import { StudentFormModal } from './StudentFormModal';
import { GradeEntry } from './GradeEntry';
import { FinalRecord } from './FinalRecord';
import { DetailedRecord } from './DetailedRecord';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { AttendanceManagement } from './AttendanceManagement';
import { ChangePinModal } from './ChangePinModal';
import { AddIcon, SearchIcon, StudentsIcon, GradesIcon, FinalRecordIcon, AnnouncementIcon, MessageIcon, ControlPanelIcon, ChartBarIcon, UsersIcon, ArchiveIcon, UploadIcon, RefreshIcon, ClipboardCheckIcon } from './Icons';

interface TeacherDashboardProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'grades' | 'messages' | 'attendance'>) => void;
  onUpdateStudent: (student: Omit<Student, 'id' | 'grades' | 'messages' | 'attendance'> & {id: string}) => void;
  onDeleteStudent: (id: string) => void;
  onBulkUpdateGrades: (updates: { studentId: string, field: keyof PeriodGrades, value: number }[]) => void;
  onDetailedRecordUpdate: (studentId: string, updatedGrades: YearGrades) => void;
  announcement: string;
  setAnnouncement: (text: string) => void;
  onSendMessage: (studentId: string, text: string, sender: 'teacher' | 'student') => void;
  activeTerm: 'semester1' | 'semester2';
  setActiveTerm: (term: 'semester1' | 'semester2') => void;
  activePeriod: 'period1' | 'period2';
  setActivePeriod: (period: 'period1' | 'period2') => void;
  gradesVisibility: {
    semester1: { period1: boolean, period2: boolean },
    semester2: { period1: boolean, period2: boolean },
  };
  setGradesVisibility: (visibility: any) => void;
  onArchiveData: () => void;
  onLoadData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetGrades: () => void;
  onUpdateAttendance: (updates: { studentId: string; date: string; periodNumber: number; status: AttendanceStatus }[]) => void;
  onChangePin: (studentId: string, newPin: string) => void;
}

type ActiveTab = 'messages' | 'control' | 'students' | 'grades' | 'general_record' | 'detailed_record' | 'announcements' | 'analysis' | 'attendance';

const VisibilityToggle: React.FC<{ label: string; isVisible: boolean; onToggle: () => void; }> = ({ label, isVisible, onToggle }) => (
  <div className="p-3 bg-white rounded-md border flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
     <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input type="checkbox" className="sr-only peer" checked={isVisible} onChange={onToggle} />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
        </div>
      </label>
  </div>
);

const ControlPanel: React.FC<Pick<TeacherDashboardProps, 'activeTerm' | 'setActiveTerm' | 'activePeriod' | 'setActivePeriod' | 'gradesVisibility' | 'setGradesVisibility' | 'onArchiveData' | 'onLoadData' | 'onResetGrades'>> = 
  ({ activeTerm, setActiveTerm, activePeriod, setActivePeriod, gradesVisibility, setGradesVisibility, onArchiveData, onLoadData, onResetGrades }) => {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTermChange = (term: 'semester1' | 'semester2') => {
      setActiveTerm(term);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handlePeriodChange = (period: 'period1' | 'period2') => {
      setActivePeriod(period);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleVisibilityChange = (term: 'semester1' | 'semester2', period: 'period1' | 'period2') => {
    setGradesVisibility((prev: any) => ({
      ...prev,
      [term]: {
        ...prev[term],
        [period]: !prev[term][period]
      }
    }));
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">تحديد الفترة النشطة للتقييم</h3>
            <p className="text-sm text-gray-500 mb-3">اختر الفصل الدراسي والفترة التي تريد رصد درجاتها حالياً.</p>
          </div>
          {showConfirmation && <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">تم تحديث الفترة النشطة</div>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
             <label className="text-sm font-medium text-gray-600">الفصل الدراسي</label>
             <div className="flex border border-gray-300 rounded-lg p-1 mt-1">
                <button
                  onClick={() => handleTermChange('semester1')}
                  className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${activeTerm === 'semester1' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  الفصل الأول
                </button>
                <button
                  onClick={() => handleTermChange('semester2')}
                  className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${activeTerm === 'semester2' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  الفصل الثاني
                </button>
              </div>
          </div>
          <div className="flex-1">
              <label className="text-sm font-medium text-gray-600">الفترة</label>
              <div className="flex border border-gray-300 rounded-lg p-1 mt-1">
                <button
                  onClick={() => handlePeriodChange('period1')}
                  className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${activePeriod === 'period1' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  الفترة الأولى
                </button>
                <button
                  onClick={() => handlePeriodChange('period2')}
                  className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${activePeriod === 'period2' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  الفترة الثانية
                </button>
              </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
         <h3 className="font-semibold text-gray-700 mb-2">إظهار الدرجات للطلاب</h3>
         <p className="text-sm text-gray-500 mb-3">تحكم في ظهور الدرجات لكل فترة بشكل مستقل.</p>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VisibilityToggle label="ف1 - فترة 1" isVisible={gradesVisibility.semester1.period1} onToggle={() => handleVisibilityChange('semester1', 'period1')} />
            <VisibilityToggle label="ف1 - فترة 2" isVisible={gradesVisibility.semester1.period2} onToggle={() => handleVisibilityChange('semester1', 'period2')} />
            <VisibilityToggle label="ف2 - فترة 1" isVisible={gradesVisibility.semester2.period1} onToggle={() => handleVisibilityChange('semester2', 'period1')} />
            <VisibilityToggle label="ف2 - فترة 2" isVisible={gradesVisibility.semester2.period2} onToggle={() => handleVisibilityChange('semester2', 'period2')} />
         </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
       <h3 className="font-semibold text-gray-700 mb-2">إدارة البيانات</h3>
       <p className="text-sm text-gray-500 mb-3">أرشفة أو استعادة بيانات الطلاب، أو إعادة رصد الدرجات لعام جديد.</p>
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={onArchiveData} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            <ArchiveIcon className="h-5 w-5"/>
            أرشفة البيانات الحالية
          </button>
          
          <button onClick={handleLoadClick} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
             <UploadIcon className="h-5 w-5"/>
             تحميل بيانات من ملف
          </button>
          <input type="file" ref={fileInputRef} onChange={onLoadData} className="hidden" accept=".json"/>

          <button onClick={onResetGrades} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
            <RefreshIcon className="h-5 w-5"/>
            إعادة رصد الدرجات
          </button>
       </div>
    </div>
    </div>
  );
};

const StudentManagement: React.FC<Pick<TeacherDashboardProps, 'students' | 'onAddStudent' | 'onUpdateStudent' | 'onDeleteStudent' | 'onChangePin'>> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent, onChangePin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Omit<Student, 'grades' | 'messages' | 'attendance'> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinChangeStudent, setPinChangeStudent] = useState<Student | null>(null);

  const openAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    const { grades, messages, attendance, ...studentInfo } = student;
    setEditingStudent(studentInfo);
    setIsModalOpen(true);
  };
  
  const openPinModal = (student: Student) => {
    setPinChangeStudent(student);
    setIsPinModalOpen(true);
  };
  
  const handlePinChange = (newPin: string) => {
    if (pinChangeStudent) {
      onChangePin(pinChangeStudent.id, newPin);
    }
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id'|'grades'|'messages'|'attendance'> | Omit<Student, 'id'|'grades'|'messages'|'attendance'> & {id: string}) => {
    if ('id' in studentData) {
      onUpdateStudent(studentData as Omit<Student, 'grades' | 'messages' | 'attendance'> & {id: string});
    } else {
      onAddStudent(studentData as Omit<Student, 'id' | 'grades' | 'messages' | 'attendance'>);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nationalId.includes(searchTerm)
    );
  }, [students, searchTerm]);

  return (
     <div className="bg-white shadow-xl rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">قائمة الطلاب</h2>
            <div className="w-full md:w-auto flex items-center gap-4">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                onClick={openAddModal}
                className="flex-shrink-0 inline-flex items-center gap-2 justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <AddIcon className="h-5 w-5" />
                <span>إضافة طالب</span>
              </button>
            </div>
          </div>
        </div>
        <StudentTable
          students={filteredStudents}
          onEdit={openEditModal}
          onDelete={onDeleteStudent}
          onChangePin={openPinModal}
        />
        {isModalOpen && (
          <StudentFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveStudent}
            student={editingStudent}
          />
        )}
        {isPinModalOpen && pinChangeStudent && (
          <ChangePinModal
            isOpen={isPinModalOpen}
            onClose={() => setIsPinModalOpen(false)}
            onSave={handlePinChange}
            studentName={pinChangeStudent.name}
          />
        )}
    </div>
  )
}

const AnnouncementManagement: React.FC<Pick<TeacherDashboardProps, 'announcement' | 'setAnnouncement'>> = ({ announcement, setAnnouncement }) => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement);

  const handleUpdateAnnouncement = () => {
    setAnnouncement(currentAnnouncement);
    alert('تم تحديث الإعلان بنجاح!');
  };

  return (
     <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">إدارة الإعلانات</h2>
        <textarea
          value={currentAnnouncement}
          onChange={(e) => setCurrentAnnouncement(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="اكتب إعلانك هنا..."
        />
        <button
          onClick={handleUpdateAnnouncement}
          className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          حفظ الإعلان
        </button>
      </div>
  )
}

const StudentMessages: React.FC<Pick<TeacherDashboardProps, 'students' | 'onSendMessage'>> = ({ students, onSendMessage }) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showIncomingOnly, setShowIncomingOnly] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const sortedStudents = useMemo(() => 
    [...students].sort((a, b) => a.name.localeCompare(b.name)), 
  [students]);

  const selectedStudentData = useMemo(() => {
    if (selectedStudentIds.length === 1) {
      return students.find(s => s.id === selectedStudentIds[0]) || null;
    }
    return null;
  }, [selectedStudentIds, students]);

  useEffect(scrollToBottom, [selectedStudentData, showIncomingOnly]);
  
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentIds(prev => {
      const isSelected = prev.includes(studentId);
      if (isSelected) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(sortedStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedStudentIds.length > 0) {
        selectedStudentIds.forEach(id => {
            onSendMessage(id, newMessage.trim(), 'teacher');
        });
        setNewMessage('');
        if(selectedStudentIds.length > 1){
            setSelectedStudentIds([]);
            alert(`تم إرسال الرسالة إلى ${selectedStudentIds.length} طالب بنجاح!`);
        }
    }
  };
  
  const messagesToShow = useMemo(() => {
    if (!selectedStudentData) return [];
    const messages = selectedStudentData.messages || [];
    if (showIncomingOnly) {
        return messages.filter(msg => msg.sender === 'student');
    }
    return messages;
  }, [selectedStudentData, showIncomingOnly]);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">رسائل الطلاب</h2>
      <div className="flex flex-col md:flex-row gap-6 h-[65vh]">
        <div className="md:w-1/3 border rounded-lg p-2 flex flex-col">
          <div className="p-2 border-b">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedStudentIds.length === sortedStudents.length && sortedStudents.length > 0}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium">تحديد الكل</span>
            </label>
          </div>
          <ul className="space-y-1 overflow-y-auto flex-grow">
            {sortedStudents.map(student => {
              const hasNewMessage = student.messages.length > 0 && student.messages[student.messages.length - 1].sender === 'student';
              return (
              <li key={student.id}>
                <label className={`w-full text-right p-2 rounded-md flex items-center justify-between cursor-pointer transition-colors ${selectedStudentIds.includes(student.id) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                   <div className="flex items-center space-x-2">
                     <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                     />
                     <span>{student.name}</span>
                   </div>
                   {hasNewMessage && (
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="رسالة جديدة"></span>
                   )}
                </label>
              </li>
            )})}
          </ul>
        </div>
        <div className="md:w-2/3 flex flex-col border rounded-lg p-4 bg-gray-50">
          {selectedStudentIds.length > 0 ? (
            <>
              {selectedStudentIds.length === 1 && selectedStudentData && (
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                  <div className="flex justify-end sticky top-0 bg-gray-50 py-2 z-10">
                     <label className="flex items-center cursor-pointer">
                        <span className="text-sm mr-2">إظهار الواردة فقط</span>
                        <div className="relative">
                          <input type="checkbox" className="sr-only peer" checked={showIncomingOnly} onChange={() => setShowIncomingOnly(!showIncomingOnly)} />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                          <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
                        </div>
                      </label>
                  </div>
                  {messagesToShow.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'teacher' ? 'bg-green-500 text-white' : 'bg-white text-gray-800 border'}`}>
                              <p>{msg.text}</p>
                              <p className={`text-xs mt-1 ${msg.sender === 'teacher' ? 'text-green-200' : 'text-gray-500'}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                              </p>
                          </div>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              {selectedStudentIds.length > 1 && (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <UsersIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 font-semibold">إرسال رسالة جماعية إلى {selectedStudentIds.length} طالب.</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={selectedStudentIds.length > 1 ? "اكتب رسالتك الجماعية هنا..." : "اكتب ردك هنا..."}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    إرسال
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>اختر طالباً أو أكثر لإرسال رسالة.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('messages');

  const tabs = [
    { id: 'messages', label: 'رسائل الطلاب', icon: MessageIcon },
    { id: 'attendance', label: 'الحضور والغياب', icon: ClipboardCheckIcon },
    { id: 'control', label: 'لوحة التحكم', icon: ControlPanelIcon },
    { id: 'analysis', label: 'تحليل الدرجات', icon: ChartBarIcon },
    { id: 'detailed_record', label: 'السجل التفصيلي', icon: FinalRecordIcon },
    { id: 'general_record', label: 'السجل العام', icon: FinalRecordIcon },
    { id: 'grades', label: 'رصد الدرجات', icon: GradesIcon },
    { id: 'students', label: 'إدارة الطلاب', icon: StudentsIcon },
    { id: 'announcements', label: 'الإعلانات', icon: AnnouncementIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-2 no-print">
        <div className="flex items-center justify-center md:justify-start -mb-px space-x-1 sm:space-x-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`whitespace-nowrap flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'control' && <ControlPanel {...props} />}
        {activeTab === 'analysis' && <AnalyticsDashboard students={props.students} />}
        {activeTab === 'students' && <StudentManagement {...props} />}
        {activeTab === 'grades' && <GradeEntry {...props} />}
        {activeTab === 'general_record' && <FinalRecord students={props.students} />}
        {activeTab === 'detailed_record' && <DetailedRecord students={props.students} onSave={props.onDetailedRecordUpdate} />}
        {activeTab === 'announcements' && <AnnouncementManagement announcement={props.announcement} setAnnouncement={props.setAnnouncement} />}
        {activeTab === 'messages' && <StudentMessages {...props} />}
        {activeTab === 'attendance' && <AttendanceManagement students={props.students} onUpdateAttendance={props.onUpdateAttendance} />}
      </div>
    </div>
  );
};