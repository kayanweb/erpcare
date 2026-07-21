import React, { useEffect, useState } from 'react';
import { BedDouble, Activity } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface Bed {
  id: string;
  number: string;
  status: 'OCCUPIED' | 'AVAILABLE';
}

interface Props {
  language: 'ar' | 'en';
}

export const CapacityManagement: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<Bed>('beds');
        setBeds(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "إدارة الطاقة الاستيعابية" : "Capacity Management Dashboard"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "رقم السرير" : "Bed Number"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {beds.map(b => (
                <tr key={b.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{b.number}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${b.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {b.status}
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
export default CapacityManagement;