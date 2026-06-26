import React from "react";
import { Building2, Building, Network, Map, Layout, Server } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function OrganizationDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "الهيكل التنظيمي والمؤسسي" : "Organization Management"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 0 Core - Multi-Tenant, Multi-Hospital, Cost Centers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
             <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <Server className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-widest">Tenants</span>
             </div>
             <p className="text-4xl font-black text-slate-900">4</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
             <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Building className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-widest">Hospitals</span>
             </div>
             <p className="text-4xl font-black text-slate-900">12</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
             <div className="flex items-center gap-3 text-emerald-600 mb-2">
                <Layout className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-widest">Departments</span>
             </div>
             <p className="text-4xl font-black text-slate-900">184</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 flex flex-col">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Network className="w-5 h-5" />
              Organizational Hierarchy
           </h3>
           <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="max-w-sm">
                 <Map className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                 <h4 className="text-lg font-black text-slate-800 mb-2">Hierarchy Visualizer</h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                   Manage Regions, Branches, Buildings, Floors, Wings, Clinics, Rooms, and Beds in a unified drag-and-drop canvas.
                 </p>
                 <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    Open Hierarchy Builder
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
