import React from 'react';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export default function DepartmentTasks({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';

  const tasks = [
    { id: 1, titleEn: 'Administer Morning Medication', titleAr: 'إعطاء الأدوية الصباحية', patient: 'Omar Samir (Room 201)', time: '08:00 AM', status: 'completed' },
    { id: 2, titleEn: 'Vital Signs Check', titleAr: 'فحص العلامات الحيوية', patient: 'Ahmed Hassan (Room 201)', time: '10:30 AM', status: 'pending' },
    { id: 3, titleEn: 'Doctor Round Assistance', titleAr: 'المساعدة في جولة الطبيب', patient: 'All Patients', time: '11:00 AM', status: 'pending' },
    { id: 4, titleEn: 'Discharge Preparation', titleAr: 'تجهيز أوراق الخروج', patient: 'Khalid Ali (Room 202)', time: '01:00 PM', status: 'pending' },
  ];

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
          {isAr ? 'مركز المهام' : 'Tasks Center'}
        </h2>
        <p className="text-slate-500 mt-1">{isAr ? 'إدارة ومتابعة مهام القسم' : 'Manage and track department tasks'}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isAr ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? 'المهمة' : 'Task'}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? 'المريض / الموقع' : 'Patient / Location'}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? 'الوقت' : 'Time'}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{isAr ? task.titleAr : task.titleEn}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{task.patient}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-mono">
                      <Clock className="w-4 h-4" /> {task.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAr ? 'مكتمل' : 'Completed'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {isAr ? 'قيد الانتظار' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {task.status !== 'completed' && (
                      <button className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold transition">
                        {isAr ? 'إنجاز' : 'Done'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
