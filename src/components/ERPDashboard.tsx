import React from "react";
import { Calculator, Briefcase, Truck, Box, DollarSign, FileText, PieChart } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function ERPDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "نظام تخطيط موارد المؤسسة" : "Enterprise Resource Planning (ERP)"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 9 - Finance, Procurement, Inventory, HR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ERPModuleCard title="Finance (GL, AP, AR)" icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <ERPModuleCard title="Procurement (PO, RFQ)" icon={Truck} color="text-blue-600" bg="bg-blue-50" />
        <ERPModuleCard title="Inventory (Warehouses)" icon={Box} color="text-amber-600" bg="bg-amber-50" />
        <ERPModuleCard title="Human Resources" icon={Briefcase} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
               <FileText className="w-5 h-5 text-slate-500" />
               Pending Approvals
            </h3>
            <div className="space-y-4">
               {[
                 { id: "PO-2026-089", desc: "Surgical Supplies Q3", amount: "$45,000", dept: "Operating Theater" },
                 { id: "PR-2026-112", desc: "MRI Machine Maintenance", amount: "$12,500", dept: "Radiology" },
                 { id: "INV-2026-44", desc: "Pharmacy Restock (Antibiotics)", amount: "$28,000", dept: "Pharmacy" },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.id}</span>
                       <p className="text-sm font-bold text-slate-800">{item.desc}</p>
                       <p className="text-[10px] text-slate-400 font-medium mt-1">{item.dept}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                       <span className="text-sm font-black text-slate-900">{item.amount}</span>
                       <div className="flex gap-2">
                          <button className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors">Approve</button>
                          <button className="text-[9px] bg-rose-50 text-rose-600 px-2 py-1 rounded font-black uppercase tracking-widest hover:bg-rose-100 transition-colors">Reject</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <PieChart className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-800 mb-2">Budget Utilization</h3>
            <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto uppercase tracking-widest mb-6">
               Connect to General Ledger to view real-time department budgets, cost centers, and financial health.
            </p>
            <button className="px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors">
               Open Financial Reports
            </button>
         </div>
      </div>
    </div>
  );
}

function ERPModuleCard({ title, icon: Icon, color, bg }: { title: string, icon: any, color: string, bg: string }) {
  return (
     <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
           <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-relaxed">{title}</h3>
     </div>
  );
}
