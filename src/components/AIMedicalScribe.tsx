import React, { useEffect, useState } from 'react';
import { Mic, FileText, CheckCircle2 } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface ScribeLog {
  id: string;
  patientId: string;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED';
}

interface Props {
  language: 'ar' | 'en';
}

export const AIMedicalScribe: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [logs, setLogs] = useState<ScribeLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<ScribeLog>('scribeLogs');
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "الكاتب الطبي بالذكاء الاصطناعي" : "AI Medical Scribe"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "رقم المريض" : "Patient ID"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{log.patientId}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${log.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>
      )}
    </div>
  );
};
export default AIMedicalScribe;