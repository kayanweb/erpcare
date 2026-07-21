import React, { useState } from 'react';
import { 
  BedDouble, CheckCircle2, AlertCircle, Search, Filter, 
  ArrowRightLeft, MapPin, Activity, ShieldAlert, Wind, 
  Building, Hotel, DoorOpen, Users, Plus, LayoutDashboard,
  MenuSquare
} from 'lucide-react';
import { useHIS } from '../context/HISContext';

interface Props {
  language?: "ar" | "en";
  forceDepartmentId?: string;
  onClose?: () => void;
}

export default function BedManagementDashboard({ language: propLanguage, forceDepartmentId, onClose }: Props = {}) {
  const { language: contextLanguage, admissionRequests, bedMap } = useHIS();
  const language = propLanguage || contextLanguage || 'en';
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'overview' | 'wards' | 'allocation'>('overview');
  
  const stats = [
    { label: isAr ? "إجمالي الأسرة" : "Total Beds", value: "350", icon: BedDouble, color: "text-blue-600", bg: "bg-blue-100" },
    { label: isAr ? "الأسرة المشغولة" : "Occupied", value: "284", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: isAr ? "الأسرة الشاغرة" : "Available", value: "42", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: isAr ? "تحت الصيانة/النظافة" : "Maintenance/Cleaning", value: "24", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" }
  ];

  const wards = [
    { id: "W-A", name: "Internal Medicine A", nameAr: "الباطنة رجال أ", capacity: 40, occupied: 38, type: "General Ward" },
    { id: "W-B", name: "Internal Medicine B", nameAr: "الباطنة نساء ب", capacity: 40, occupied: 35, type: "General Ward" },
    { id: "W-S1", name: "Surgery 1", nameAr: "الجراحة ١", capacity: 30, occupied: 25, type: "Surgical Ward" },
    { id: "W-S2", name: "Surgery 2", nameAr: "الجراحة ٢", capacity: 30, occupied: 29, type: "Surgical Ward" },
    { id: "ICU-1", name: "Main ICU", nameAr: "العناية المركزة", capacity: 20, occupied: 18, type: "Critical Care" },
    { id: "NICU", name: "NICU", nameAr: "العناية المركزة لحديثي الولادة", capacity: 15, occupied: 12, type: "Critical Care" },
    { id: "PEDS", name: "Pediatrics", nameAr: "طب الأطفال", capacity: 40, occupied: 30, type: "General Ward" },
    { id: "OBS", name: "Obstetrics", nameAr: "الولادة", capacity: 35, occupied: 32, type: "Maternity" }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 shadow-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <Hotel size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "إدارة الأسرة الذكية" : "Smart Bed Allocation"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "مراقبة الإشغال والتوزيع الذكي للأسرة" : "Occupancy Monitoring & Intelligent Allocation"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">{stat.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <LayoutDashboard size={16} />
              {isAr ? "نظرة عامة" : "Overview"}
            </button>
            <button 
              onClick={() => setActiveTab('wards')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'wards' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <Building size={16} />
              {isAr ? "الأقسام (Wards)" : "Wards Layout"}
            </button>
            <button 
              onClick={() => setActiveTab('allocation')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'allocation' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <ArrowRightLeft size={16} />
              {isAr ? "التخصيص والتحويل" : "Allocation & Transfer"}
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px]">14</span>
            </button>
          </div>

          <div className="p-0">
            {activeTab === 'overview' && (
              <div className="p-6">
                <h3 className="font-bold text-slate-800 mb-6">{isAr ? "إشغال الأقسام" : "Ward Occupancy"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {wards.map(ward => {
                    const percentage = Math.round((ward.occupied / ward.capacity) * 100);
                    let statusColor = "bg-emerald-500";
                    if (percentage >= 90) statusColor = "bg-rose-500";
                    else if (percentage >= 80) statusColor = "bg-amber-500";

                    return (
                      <div key={ward.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-800">{isAr ? ward.nameAr : ward.name}</h4>
                            <p className="text-xs text-slate-500">{ward.type}</p>
                          </div>
                          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{ward.id}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{isAr ? "الإشغال:" : "Occupancy:"}</span>
                            <span className="font-bold text-slate-800">{ward.occupied} / {ward.capacity} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className={`${statusColor} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'wards' && (
              <div className="p-12 text-center text-slate-400">
                <DoorOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">{isAr ? "مخطط الأقسام التفصيلي" : "Detailed Ward Layout"}</h3>
                <p className="text-sm">{isAr ? "عرض خريطة الأسرة لكل قسم" : "View visual bed map for each ward"}</p>
              </div>
            )}

            {activeTab === 'allocation' && (
              <div className="p-12 text-center text-slate-400">
                <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">{isAr ? "تخصيص الأسرة" : "Bed Allocation"}</h3>
                <p className="text-sm">{isAr ? "تخصيص الأسرة لطلبات التنويم المعلقة" : "Assign beds to pending admission requests"}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
