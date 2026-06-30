import React from 'react';
import { Users, BedDouble, Activity, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default function DepartmentDashboard({ language, departmentName }: { language: 'ar' | 'en', departmentName: string }) {
  const isAr = language === 'ar';

  const stats = [
    { label: isAr ? 'المرضى المنومين' : 'Admitted Patients', value: '24', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: isAr ? 'الأسرة الشاغرة' : 'Available Beds', value: '8', icon: BedDouble, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: isAr ? 'المهام المعلقة' : 'Pending Tasks', value: '15', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: isAr ? 'حالات حرجة' : 'Critical Cases', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-2xl font-black text-slate-800">{isAr ? 'نظرة عامة:' : 'Overview:'} {departmentName}</h2>
        <p className="text-slate-500 mt-1">{isAr ? 'مؤشرات الأداء الرئيسية للقسم' : 'Key performance indicators for the department'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-500" />
            {isAr ? 'الأنشطة الأخيرة' : 'Recent Activities'}
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{isAr ? 'تحديث حالة المريض' : 'Patient Status Update'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{isAr ? 'تم تحديث حالة المريض MRN-101 إلى مستقرة' : 'Patient MRN-101 status updated to stable'}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">10:45 AM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            {isAr ? 'إشغال القسم' : 'Department Occupancy'}
          </h3>
          <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">{isAr ? 'رسم بياني للإشغال' : 'Occupancy Chart Placeholder'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
