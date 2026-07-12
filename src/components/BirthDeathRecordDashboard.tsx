import React, { useState } from "react";
import { Baby, FileText, Search, Plus, Filter, Activity, FileDigit } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function BirthDeathRecordDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"birth" | "death" | "reports">("birth");

  const birthRecords = [
    { id: "BR-2023-001", childName: "Baby Boy Ahmed", gender: "Male", date: "2023-10-25", time: "08:30 AM", motherName: "Sara Ali", physician: "Dr. Laila" },
    { id: "BR-2023-002", childName: "Baby Girl Noor", gender: "Female", date: "2023-10-25", time: "11:15 AM", motherName: "Mona Salem", physician: "Dr. Fatima" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Baby className="w-8 h-8 text-pink-600 bg-pink-100 p-1.5 rounded-xl" />
            {isAr ? "سجل المواليد والوفيات" : "Birth & Death Records"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة وتوثيق سجلات المواليد والوفيات" : "Manage and document birth and death records"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "birth", labelAr: "سجل المواليد", labelEn: "Birth Records", icon: Baby },
          { id: "death", labelAr: "سجل الوفيات", labelEn: "Death Records", icon: FileDigit },
          { id: "reports", labelAr: "التقارير", labelEn: "Reports", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-pink-100 text-pink-700"
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
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-pink-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => toast.success(isAr ? "تم فتح نافذة الإضافة" : "Add modal opened")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "تسجيل جديد" : "New Record"}
            </button>
          </div>
        </div>

        {activeTab === "birth" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "رقم السجل" : "Record ID"}</th>
                  <th className="px-4 py-3">{isAr ? "اسم المولود" : "Child Name"}</th>
                  <th className="px-4 py-3">{isAr ? "الجنس" : "Gender"}</th>
                  <th className="px-4 py-3">{isAr ? "تاريخ ووقت الولادة" : "Birth Date & Time"}</th>
                  <th className="px-4 py-3">{isAr ? "اسم الأم" : "Mother Name"}</th>
                  <th className="px-4 py-3">{isAr ? "الطبيب المشرف" : "Physician"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {birthRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.childName}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${r.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {r.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.date} {r.time}</td>
                    <td className="px-4 py-3 text-slate-600">{r.motherName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.physician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "death" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <FileDigit className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "سجل الوفيات" : "Death Records"}</h3>
            <p className="text-slate-500">{isAr ? "لا توجد سجلات وفيات حالياً" : "No death records found"}</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-4">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-lg"><Baby className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-slate-500 font-bold">{isAr ? "إجمالي المواليد (الشهر)" : "Total Births (Month)"}</p>
                <p className="text-2xl font-black text-slate-800">142</p>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-4">
              <div className="p-3 bg-slate-200 text-slate-600 rounded-lg"><FileDigit className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-slate-500 font-bold">{isAr ? "إجمالي الوفيات (الشهر)" : "Total Deaths (Month)"}</p>
                <p className="text-2xl font-black text-slate-800">12</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
