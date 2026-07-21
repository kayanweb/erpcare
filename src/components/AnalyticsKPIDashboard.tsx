import React from 'react';
import { 
  TrendingUp, TrendingDown, Activity, Users, DollarSign, 
  Clock, HeartPulse, ShieldAlert, BarChart3, PieChart
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export default function AnalyticsKPIDashboard({ language }: Props) {
  const isAr = language === 'ar';
  
  return (
    <div className="flex flex-col h-full bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 shadow-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "تحليلات الأداء (KPIs)" : "Executive Analytics"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "مؤشرات الأداء الرئيسية والتقارير الاستراتيجية" : "Key Performance Indicators & Strategic Reports"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex items-center justify-center">
         <div className="text-center text-slate-400 space-y-4">
            <PieChart className="w-16 h-16 mx-auto opacity-20" />
            <h2 className="text-xl font-bold text-slate-600">{isAr ? "وحدة تحليلات البيانات" : "Data Analytics Module"}</h2>
            <p className="text-sm font-medium">{isAr ? "جاري ربط مستودع البيانات وبناء لوحات القيادة التفاعلية" : "Integrating with data warehouse and building interactive dashboards..."}</p>
         </div>
      </div>
    </div>
  );
}
