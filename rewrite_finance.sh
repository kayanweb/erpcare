cat << 'INNER_EOF' > src/components/FinanceIncomeExpenseDashboard.tsx
import React, { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Plus, Search, PieChart, Filter, Activity } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function FinanceIncomeExpenseDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "summary">("income");

  const transactions = [
    { id: "TRX-001", date: "2023-10-25", description: "Outpatient Billing", category: "Medical Services", amount: 12500, type: "income" },
    { id: "TRX-002", date: "2023-10-25", description: "Pharmacy Sales", category: "Pharmacy", amount: 4300, type: "income" },
    { id: "TRX-003", date: "2023-10-25", description: "Medical Supplies Purchase", category: "Inventory", amount: 8000, type: "expense" },
    { id: "TRX-004", date: "2023-10-24", description: "Staff Salaries (Advance)", category: "Payroll", amount: 25000, type: "expense" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-rose-600 bg-rose-100 p-1.5 rounded-xl" />
            {isAr ? "المالية والمصروفات" : "Finance (Income & Expense)"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة الإيرادات والمصروفات اليومية والملخص المالي" : "Manage daily income, expenses, and financial summary"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "income", labelAr: "الإيرادات", labelEn: "Income", icon: TrendingUp },
          { id: "expense", labelAr: "المصروفات", labelEn: "Expenses", icon: TrendingDown },
          { id: "summary", labelAr: "الملخص المالي", labelEn: "Financial Summary", icon: PieChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-rose-100 text-rose-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-rose-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
                <Filter className="w-5 h-5" />
             </button>
             <button
               onClick={() => toast.success(isAr ? "تم فتح نافذة الإضافة" : "Add modal opened")}
               className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
             >
               <Plus className="w-4 h-4" />
               {isAr ? "تسجيل حركة" : "Record Entry"}
             </button>
          </div>
        </div>

        {activeTab === "income" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "رقم الحركة" : "Transaction ID"}</th>
                  <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                  <th className="px-4 py-3">{isAr ? "الوصف" : "Description"}</th>
                  <th className="px-4 py-3">{isAr ? "التصنيف" : "Category"}</th>
                  <th className="px-4 py-3 text-right">{isAr ? "المبلغ" : "Amount"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.filter(t => t.type === 'income').map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{t.id}</td>
                    <td className="px-4 py-3 text-slate-600">{t.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{t.description}</td>
                    <td className="px-4 py-3 text-slate-600"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{t.category}</span></td>
                    <td className="px-4 py-3 text-right font-black text-emerald-600">+{t.amount.toLocaleString()} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "expense" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "رقم الحركة" : "Transaction ID"}</th>
                  <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                  <th className="px-4 py-3">{isAr ? "الوصف" : "Description"}</th>
                  <th className="px-4 py-3">{isAr ? "التصنيف" : "Category"}</th>
                  <th className="px-4 py-3 text-right">{isAr ? "المبلغ" : "Amount"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.filter(t => t.type === 'expense').map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{t.id}</td>
                    <td className="px-4 py-3 text-slate-600">{t.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{t.description}</td>
                    <td className="px-4 py-3 text-slate-600"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{t.category}</span></td>
                    <td className="px-4 py-3 text-right font-black text-rose-600">-{t.amount.toLocaleString()} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
               <div className="flex items-center gap-3 mb-2 text-emerald-700">
                 <TrendingUp className="w-5 h-5" />
                 <h4 className="font-bold">{isAr ? "إجمالي الإيرادات (الشهر)" : "Total Income (Month)"}</h4>
               </div>
               <p className="text-3xl font-black text-emerald-800">245,000 SAR</p>
            </div>
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
               <div className="flex items-center gap-3 mb-2 text-rose-700">
                 <TrendingDown className="w-5 h-5" />
                 <h4 className="font-bold">{isAr ? "إجمالي المصروفات (الشهر)" : "Total Expense (Month)"}</h4>
               </div>
               <p className="text-3xl font-black text-rose-800">182,500 SAR</p>
            </div>
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
               <div className="flex items-center gap-3 mb-2 text-indigo-700">
                 <Activity className="w-5 h-5" />
                 <h4 className="font-bold">{isAr ? "صافي الدخل" : "Net Income"}</h4>
               </div>
               <p className="text-3xl font-black text-indigo-800">62,500 SAR</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
INNER_EOF
