import React from 'react';
import type { Student } from '../types';
import { EditIcon, DeleteIcon, WhatsAppIcon, KeyIcon } from './Icons';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onChangePin: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete, onChangePin }) => {
  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-b-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاسم
                </th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الجوال
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفصل
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الهوية (آخر 4)
                </th>
                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ltr text-right">
                       {student.phone ? (
                        <a href={`https://wa.me/${student.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800">
                          <WhatsAppIcon className="h-5 w-5" />
                          {student.phone}
                        </a>
                       ) : (
                        <span>-</span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.class === 'ثالث متوسط 2' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.nationalId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => onEdit(student)} className="text-gray-500 hover:text-blue-700 transition-colors duration-200" title="تعديل">
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => onChangePin(student)} className="text-gray-500 hover:text-yellow-700 transition-colors duration-200" title="تغيير الرمز">
                          <KeyIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => onDelete(student.id)} className="text-gray-500 hover:text-red-700 transition-colors duration-200" title="حذف">
                          <DeleteIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    لم يتم العثور على طلاب.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};