import React, { useState } from 'react';
import { PrintIcon, TrophyIcon } from './Icons';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  certificates: { periodName: string; score: number }[];
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, studentName, certificates }) => {
  const [selectedCert, setSelectedCert] = useState(certificates[0]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContents = document.getElementById('certificate-print-area')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // To re-attach event listeners
    }
  };

  return (
    <div className="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                شهادات التقدير والتفوق
              </h3>
              <div className="flex items-center gap-2 no-print">
                <button onClick={handlePrint} className="inline-flex items-center gap-2 px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700">
                    <PrintIcon className="h-4 w-4" />
                    طباعة الشهادة
                </button>
                <button type="button" onClick={onClose} className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                  إغلاق
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 border rounded-lg p-3 space-y-2 bg-gray-50 no-print">
                   <h4 className="font-semibold">الشهادات المستحقة:</h4>
                   {certificates.map(cert => (
                     <button 
                        key={cert.periodName}
                        onClick={() => setSelectedCert(cert)}
                        className={`w-full text-right p-2 rounded-md transition-colors text-sm ${selectedCert.periodName === cert.periodName ? 'bg-blue-500 text-white shadow' : 'hover:bg-gray-200'}`}
                     >
                       <p className="font-semibold">{cert.periodName}</p>
                       <p>الدرجة: {cert.score.toFixed(2)}</p>
                     </button>
                   ))}
                </div>
                <div className="md:w-2/3">
                    <div id="certificate-print-area" className="p-6 border-4 border-yellow-400 bg-yellow-50 rounded-lg aspect-[1/1.414] flex flex-col items-center justify-center relative">
                       <div className="absolute top-4 right-4 left-4 bottom-4 border-2 border-yellow-300 rounded-md"></div>
                       <TrophyIcon className="w-20 h-20 text-yellow-500" />
                       <h1 className="text-3xl font-bold mt-4 text-gray-800">شهادة شكر وتقدير</h1>
                       <p className="mt-4 text-lg">نتقدم بخالص الشكر والتقدير للطالب</p>
                       <p className="text-2xl font-bold text-blue-700 my-4 px-8 py-2 border-y-2 border-gray-300">{studentName}</p>
                       <p className="text-center text-lg">
                         على تفوقه وتميزه في مادة القران الكريم والدراسات الاسلامية
                         <br />
                         خلال <span className="font-semibold">{selectedCert.periodName}</span>
                         <br/>
                         وحصوله على درجة <span className="font-bold">{selectedCert.score.toFixed(2)}</span>
                       </p>
                       <p className="mt-8 text-lg">مع أطيب التمنيات بدوام التفوق والنجاح</p>
                       <div className="mt-12 text-center">
                         <p className="font-semibold">معلم المادة</p>
                         <p className="text-lg">محمد الحربي</p>
                         <p className="text-sm text-gray-500 mt-4">سجل متابعة الطلاب</p>
                       </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};