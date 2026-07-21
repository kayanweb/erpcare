import React, { useMemo } from "react";
import { Bed, Info, Plus, Settings, User, Clock, AlertTriangle } from "lucide-react";
import { useHIS } from "../../context/HISContext";
import { GlobalEntityLink } from "../GlobalEntityLink";

export default function BedManagement({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  const { patients = [] } = useHIS();

  const wardPatients = useMemo(() => {
    return patients.filter(p => p.departmentId === moduleType);
  }, [patients, moduleType]);

  // Mock beds for now but linking real patients to them
  const beds = useMemo(() => {
    return [
      { id: "101-A", type: "Standard", status: "Occupied", patient: wardPatients[0] || null },
      { id: "101-B", type: "Standard", status: "Occupied", patient: wardPatients[1] || null },
      { id: "102-A", type: "Standard", status: "Available", patient: null },
      { id: "102-B", type: "Standard", status: "Available", patient: null },
      { id: "103-A", type: "Isolation", status: "Occupied", patient: wardPatients[2] || null },
      { id: "103-B", type: "Isolation", status: "Available", patient: null },
      { id: "104-A", type: "Standard", status: "Occupied", patient: wardPatients[3] || null },
      { id: "104-B", type: "Standard", status: "Available", patient: null },
      { id: "105-A", type: "Standard", status: "Available", patient: null },
      { id: "105-B", type: "Standard", status: "Available", patient: null },
      { id: "106-A", type: "Standard", status: "Available", patient: null },
      { id: "106-B", type: "Standard", status: "Available", patient: null },
    ];
  }, [wardPatients]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isAr ? "إدارة أسرة القسم" : "Ward Bed Management"}</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{isAr ? "توزيع المرضى ومتابعة الإشغال" : "Patient allocation & occupancy monitoring"}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
             <Settings className="w-4 h-4"/> 
             {isAr ? "إعدادات القسم" : "Unit Config"}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
             <Plus className="w-4 h-4"/> 
             {isAr ? "إضافة سرير" : "Add Physical Bed"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {beds.map((bed, i) => (
          <div 
            key={i} 
            className={`group bg-white border rounded-[32px] p-6 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1 ${
              bed.status === 'Occupied' 
                ? 'border-indigo-100 bg-indigo-50/10' 
                : 'border-slate-100 hover:border-emerald-200'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                  bed.status === 'Occupied' 
                    ? 'bg-indigo-600 text-white border-indigo-500' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
               }`}>
                  <Bed className="w-6 h-6" />
               </div>
               <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  bed.status === 'Occupied' 
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
               }`}>
                  {bed.status}
               </div>
            </div>
            
            <h3 className="font-black text-slate-900 text-base mb-1">{bed.id}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{bed.type}</p>

            <div className="pt-6 border-t border-slate-100">
               {bed.patient ? (
                 <div className="space-y-3">
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Assigned Patient</p>
                       <p className="text-xs font-black text-slate-800 truncate leading-tight">
                          <GlobalEntityLink 
                            entityId={bed.patient.id} 
                            entityName={isAr ? bed.patient.nameAr : bed.patient.nameEn} 
                            entityType="patient" 
                            isAr={isAr}
                          >
                             {isAr ? bed.patient.nameAr : bed.patient.nameEn}
                          </GlobalEntityLink>
                       </p>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase">2d 4h</span>
                       </div>
                       {bed.patient.triageLevel === 1 && (
                         <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                       )}
                    </div>
                 </div>
               ) : (
                 <button className="w-full py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                    {isAr ? "تخصيص" : "Assign"}
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
