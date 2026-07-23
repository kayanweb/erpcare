import React, { useEffect, useState } from 'react';
import { Activity, Server } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface APIEndpoint {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  lastPing: string;
}

interface Props {
  language: 'ar' | 'en';
}

export const APICenterDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<APIEndpoint>('apiEndpoints');
        setEndpoints(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "مركز التكامل والربط" : "API Center Dashboard"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "اسم الخدمة" : "Service Name"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(ep => (
                <tr key={ep.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{ep.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${ep.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {ep.status}
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
export default APICenterDashboard;