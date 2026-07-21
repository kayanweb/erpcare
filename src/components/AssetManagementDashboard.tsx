import React, { useEffect, useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface Asset {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OFFLINE';
}

interface Props {
  language: 'ar' | 'en';
}

export const AssetManagementDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<Asset>('assets');
        setAssets(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "إدارة الأصول" : "Asset Management Dashboard"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "اسم الأصل" : "Asset Name"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{a.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${a.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {a.status}
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
export default AssetManagementDashboard;