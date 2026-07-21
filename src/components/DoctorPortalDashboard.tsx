import React, { useEffect, useState } from 'react';
import { firestoreService } from '../lib/firestoreService';

interface DataRecord {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  language: 'ar' | 'en';
}

export const DoctorPortalDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [data, setData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await firestoreService.getAll<DataRecord>('doctorportaldashboard');
        setData(records);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "DoctorPortalDashboard" : "Doctor Portal Dashboard"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الاسم" : "Name"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map(record => (
                <tr key={record.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{record.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${record.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                    {isAr ? "لا توجد سجلات" : "No records found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
</div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortalDashboard;
