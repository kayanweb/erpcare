import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldAlert, Cpu, HeartPulse, BedDouble, 
  Wind, Zap, Map, Users, Stethoscope, Syringe, TestTube,
  Microscope, FileText, Banknote, ShieldCheck, Wrench, Siren, Car,
  Clock, TrendingUp, TrendingDown, Maximize2, CheckCircle, 
  ChevronRight, AlertTriangle, UserPlus, UserMinus, BarChart3
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export default function MedicalCommandCenter({ language }: Props) {
  const isAr = language === 'ar';
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const alerts = [
    { id: 1, type: 'critical', dept: 'ER', message: 'Triage Level 1 Patient Arrival - Bay 4', time: '2m ago' },
    { id: 2, type: 'warning', dept: 'LAB', message: 'Stat Result Pending > 60 mins: MRN-9921', time: '5m ago' },
    { id: 3, type: 'info', dept: 'WARD B', message: 'Physician Rounding In Progress', time: '12m ago' },
  ];

  return (
    <div className={`h-full bg-slate-50 flex flex-col overflow-hidden ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Strategic Header */}
      <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "مركز العمليات والقيادة الاستراتيجية" : "Strategic Operations Command Center"}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isAr ? "حالة النظام: تشغيل كامل" : "SYSTEM STATUS: FULL OPERATIONAL"} • GLOBAL_SYNC_ON
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl font-mono text-2xl text-emerald-400 font-black tracking-widest shadow-xl flex flex-wrap items-center gap-2 sm:gap-3">
            <Clock size={20} className="text-slate-500" />
            {time}
          </div>
          <button className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-400 transition-all shadow-sm">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Operational Grid */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-y-auto custom-scrollbar">
        
        {/* Real-time Triage & Capacity */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-indigo-600" />
                {isAr ? "إشغال الأقسام" : "Departmental Load"}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500">REAL-TIME</span>
            </h3>
            <div className="space-y-6">
              {[
                { label: isAr ? "الطوارئ" : "Emergency Dept", value: 85, color: "bg-rose-500", pts: 42 },
                { label: isAr ? "التنويم" : "Inpatient Wards", value: 92, color: "bg-amber-500", pts: 214 },
                { label: isAr ? "العيادات" : "Outpatient Clinics", value: 65, color: "bg-indigo-500", pts: 128 },
                { label: isAr ? "العناية المركزة" : "ICU / CCU", value: 98, color: "bg-rose-600", pts: 18 }
              ].map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="text-sm font-black text-slate-700">{dept.label}</div>
                      <div className="text-[10px] font-bold text-slate-400">{dept.pts} {isAr ? "مريض حالياً" : "active patients"}</div>
                    </div>
                    <div className="text-lg font-black text-slate-800">{dept.value}%</div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                    <div className={`${dept.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${dept.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Siren size={16} className="text-rose-600" />
              {isAr ? "تنبيهات النظام الحرجة" : "Critical Operations Feed"}
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                  alert.type === 'critical' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`mt-1 ${alert.type === 'critical' ? 'text-rose-600' : 'text-slate-400'}`}>
                    {alert.type === 'critical' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${alert.type === 'critical' ? 'text-rose-600' : 'text-slate-500'}`}>{alert.dept}</span>
                      <span className="text-[9px] font-bold text-slate-400">{alert.time}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700 leading-relaxed">{alert.message}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic KPIs & Map */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:border-indigo-300 transition-all group">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <BedDouble size={20} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "إجمالي الأسرة" : "Total Beds"}</div>
              </div>
              <div className="text-3xl font-black text-slate-800">412 / 450</div>
              <div className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" /> +5% {isAr ? "منذ الأمس" : "since yesterday"}
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:border-indigo-300 transition-all group">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <Clock size={20} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "انتظار الطوارئ" : "ER Wait Time"}</div>
              </div>
              <div className="text-3xl font-black text-slate-800">24 <span className="text-xs font-bold text-slate-400 uppercase">min</span></div>
              <div className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                <TrendingDown size={12} className="text-emerald-500" /> -12% {isAr ? "تحسن" : "improvement"}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Map size={16} className="text-indigo-600" />
                {isAr ? "خريطة تدفق الموارد" : "Resource Flow Matrix"}
              </h3>
              <div className="flex gap-2 min-w-max">
                <button className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-600">Level 1</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400">Level 2</button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
               {/* Human-readable operational floorplan visualization */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-2 p-8 w-full h-full opacity-40">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-slate-300 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                      Zone {String.fromCharCode(65 + i)}
                    </div>
                  ))}
               </div>
               <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-indigo-600 mb-6 animate-bounce">
                    <Activity size={32} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{isAr ? "تحليل الكثافة التشغيلية" : "Operational Density Heatmap"}</h4>
                  <p className="text-xs font-bold text-slate-500 mt-2 max-w-xs">{isAr ? "يتم دمج بيانات الموقع الجغرافي للمرضى والطواقم الطبية لتحديد نقاط الضغط." : "Integrating patient and staff location telemetry to identify departmental pressure points."}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Financial & Logistics Pulse */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              {isAr ? "المؤشرات المالية الحية" : "Live Revenue Pulse"}
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isAr ? "الإيرادات اليومية" : "Day-to-Date Revenue"}</div>
                <div className="text-lg sm:text-2xl font-black text-emerald-400">$412,450</div>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-1">{isAr ? "مطالبات معلقة" : "Pending Claims"}</div>
                  <div className="text-sm font-black">1,240</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-1">{isAr ? "معدل الرفض" : "Denial Rate"}</div>
                  <div className="text-sm font-black text-rose-400">4.2%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              {isAr ? "كفاءة الموارد البشرية" : "HR & Staffing Matrix"}
            </h3>
            <div className="space-y-5">
              {[
                { label: isAr ? "الأطباء" : "Physicians", count: "42 / 45", status: "Nominal" },
                { label: isAr ? "التمريض" : "Nursing Staff", count: "112 / 120", status: "Nominal" },
                { label: isAr ? "الفنيين" : "Technicians", count: "28 / 30", status: "Critical", alert: true }
              ].map((staff, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-700">{staff.label}</div>
                    <div className="text-[10px] font-bold text-slate-400">{staff.count} {isAr ? "مداوم" : "on duty"}</div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${staff.alert ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {staff.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              {isAr ? "عرض جدول المناوبات الكامل" : "View Full Roster Matrix"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const LayoutDashboard = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
