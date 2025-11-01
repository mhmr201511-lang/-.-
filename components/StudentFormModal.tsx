import React, { useState, useEffect } from 'react';
import type { Student } from '../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Updated Omit to include 'messages' and 'attendance' as the form does not handle them.
  // This resolves type errors when calling onSave with student data that lacks these properties.
  onSave: (student: Omit<Student, 'id' | 'grades' | 'messages' | 'attendance'> | (Omit<Student, 'id' | 'grades' | 'messages' | 'attendance'> & {id: string})) => void;
  // FIX: Updated Omit to include 'messages' and 'attendance'. The component receives a student object
  // without 'grades', 'messages', or 'attendance' for editing basic info. This fixes a type
  // mismatch with the `editingStudent` state in `TeacherDashboard`.
  student: Omit<Student, 'grades' | 'messages' | 'attendance'> | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [studentClass, setStudentClass] = useState<'ثالث متوسط 2' | 'ثالث متوسط 3'>('ثالث متوسط 3');

  useEffect(() => {
    if (student) {
      setName(student.name);
      setNationalId(student.nationalId);
      setPhone(student.phone || '');
      setStudentClass(student.class)
    } else {
      setName('');
      setNationalId('');
      setPhone('');
      setStudentClass('ثالث متوسط 3');
    }
  }, [student, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 4 || !/^\d{4}$/.test(nationalId)) {
      alert("رقم الهوية يجب أن يتكون من 4 أرقام.");
      return;
    }
    
    const studentData = { name, nationalId, class: studentClass, phone };
    if (student) {
      onSave({ ...studentData, id: student.id });
    } else {
      onSave(studentData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {student ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                      <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
                    </div>
                     <div>
                      <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">رقم الهوية (آخر 4 أرقام)</label>
                      <input type="text" name="nationalId" id="nationalId" value={nationalId} onChange={(e) => setNationalId(e.target.value)} required maxLength={4} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
                    </div>
                     <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">رقم الجوال (اختياري)</label>
                      <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثال: 9665XXXXXXXX" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 ltr"/>
                    </div>
                    <div>
                      <label htmlFor="class" className="block text-sm font-medium text-gray-700">الفصل الدراسي</label>
                      <select id="class" name="class" value={studentClass} onChange={(e) => setStudentClass(e.target.value as 'ثالث متوسط 2' | 'ثالث متوسط 3')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option>ثالث متوسط 3</option>
                        <option>ثالث متوسط 2</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                حفظ
              </button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};