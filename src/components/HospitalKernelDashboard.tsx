import React, { useState } from 'react';
import { 
  Server, ShieldAlert, Cpu, Activity, Database, Key, Settings,
  Globe, Lock, Zap, HardDrive, ShieldCheck
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export default function HospitalKernelDashboard({ language }: Props) {
  const isAr = language === 'ar';
  
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 shrink-0 shadow-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              {isAr ? "نواة النظام وإدارة السيرفرات (IT)" : "System Kernel & IT Operations"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "التحكم في البنية التحتية، الصلاحيات، وقواعد البيانات" : "Infrastructure, Access Control & Database Management"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex items-center justify-center">
         <div className="text-center text-slate-500 space-y-4">
            <Cpu className="w-16 h-16 mx-auto opacity-20" />
            <h2 className="text-xl font-bold text-slate-400">{isAr ? "لوحة تحكم قسم تقنية المعلومات" : "IT Operations Dashboard"}</h2>
            <p className="text-sm font-medium">{isAr ? "جاري بناء واجهات إدارة الخوادم وإعدادات النظام الأساسية..." : "Building server management and core system configuration interfaces..."}</p>
         </div>
      </div>
    </div>
  );
}
