import React, { useState } from 'react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPin: string) => void;
  studentName: string;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose, onSave, studentName }) => {
  const [newPin, setNewPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      alert("رمز الدخول يجب أن يتكون من 4 أرقام.");
      return;
    }
    onSave(newPin);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="text-center sm:text-right">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  تغيير رمز دخول الطالب
                </h3>
                <p className="text-sm text-gray-500 mt-1">الطالب: {studentName}</p>
                <div className="mt-4">
                  <label htmlFor="newPin" className="block text-sm font-medium text-gray-700">رمز الدخول الجديد (4 أرقام)</label>
                  <input
                    type="text"
                    name="newPin"
                    id="newPin"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    required
                    maxLength={4}
                    pattern="\d{4}"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-center text-lg tracking-[.5em]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                حفظ الرمز الجديد
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
