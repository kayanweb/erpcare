import React, { useState } from "react";
import { Calculator, Briefcase, Truck, Box, DollarSign, FileText, PieChart, TrendingUp, Users, Target, Activity, Search, Filter, Plus } from "lucide-react";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function ERPDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"finance" | "hr" | "inventory" | "procurement">("finance");
  
  const modules = [
    { id: "finance", title: isAr ? "المالية والحسابات" : "Finance & GL", icon: DollarSign },
    { id: "hr", title: isAr ? "الموارد البشرية" : "Human Resources", icon: Users },
    { id: "inventory", title: isAr ? "المخازن والمستودعات" : "Inventory", icon: Box },
    { id: "procurement", title: isAr ? "المشتريات" : "Procurement", icon: Truck },
  ] as const;

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0">
            <Calculator className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "نظام تخطيط موارد المؤسسة" : "Enterprise Resource Planning"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              {isAr ? "المالية، الموارد البشرية، المشتريات، المخازن" : "Finance, HR, Procurement, Inventory"}
            </p>
          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 overflow-x-auto max-w-full">
          {modules.map(mod => (
            <button 
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === mod.id ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <mod.icon className="w-4 h-4" />
              {mod.title}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "finance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title={isAr ? "إجمالي الإيرادات" : "Total Revenue"} value="$2.4M" trend="+12.5%" isGood={true} icon={TrendingUp} />
            <StatCard title={isAr ? "إجمالي المصروفات" : "Total Expenses"} value="$1.1M" trend="-2.4%" isGood={true} icon={Activity} />
            <StatCard title={isAr ? "النقد المتوفر" : "Cash on Hand"} value="$4.8M" trend="+5.2%" isGood={true} icon={DollarSign} />
            <StatCard title={isAr ? "المستحقات" : "Accounts Receivable"} value="$850K" trend="+15%" isGood={false} icon={Target} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                <PieChart className="w-20 h-20 text-slate-200 mb-6" />
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Budget Utilization</h3>
                <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
                   Connect to General Ledger to view real-time department budgets, cost centers, and financial health metrics.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                     View General Ledger
                  </button>
                  <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                     Export Reports
                  </button>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      {isAr ? "الموافقات المعلقة" : "Pending Approvals"}
                   </h3>
                   <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">{isAr ? "عرض الكل" : "View All"}</button>
                </div>
                <div className="space-y-4">
                   {[
                     { id: "PO-2026-089", desc: "Surgical Supplies Q3", amount: "$45,000", dept: "Operating Theater" },
                     { id: "PR-2026-112", desc: "MRI Machine Maintenance", amount: "$12,500", dept: "Radiology" },
                     { id: "INV-2026-44", desc: "Pharmacy Restock (Antibiotics)", amount: "$28,000", dept: "Pharmacy" },
                     { id: "PAY-2026-12", desc: "Contractor Payment", amount: "$8,500", dept: "Maintenance" },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">{item.id}</span>
                              <span className="text-[10px] font-bold text-slate-500">{item.dept}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-800">{item.desc}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                           <span className="text-base font-black text-slate-900">{item.amount}</span>
                           <div className="flex gap-2">
                              <button className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors border border-emerald-100">Approve</button>
                              <button className="text-[10px] bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest hover:bg-rose-100 transition-colors border border-rose-100">Reject</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === "hr" && (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-sm text-center p-8">
           <Users className="w-20 h-20 text-indigo-200 mb-6" />
           <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Human Resources System</h3>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
             Manage payroll, employee records, attendance, shifts, leave requests, and performance evaluations.
           </p>
           <button className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all">
             Open HR Portal
           </button>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-sm text-center p-8">
           <Box className="w-20 h-20 text-amber-200 mb-6" />
           <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Inventory Management</h3>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
             Track stock levels across multiple warehouses and departments, manage expiration dates, and automate reordering.
           </p>
           <button className="px-8 py-3 bg-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all">
             Open Inventory Hub
           </button>
        </div>
      )}

      {activeTab === "procurement" && (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-sm text-center p-8">
           <Truck className="w-20 h-20 text-blue-200 mb-6" />
           <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Procurement Engine</h3>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
             Manage supplier relationships, purchase orders, requests for quotation (RFQs), and vendor payments.
           </p>
           <button className="px-8 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">
             Manage Vendors & POs
           </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, trend, isGood, icon: Icon }: any) {
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
         <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
               <Icon className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${isGood ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
               {trend}
            </span>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
         <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
   );
}
