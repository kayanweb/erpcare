import React, { useState } from "react";
import { 
  Users, UserPlus, Clock, CalendarDays, 
  DollarSign, FileText, BarChart
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  systemUsers?: any[];
}

export default function HRDashboard({ language, systemUsers = [] }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"directory" | "attendance">("directory");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            {isAr ? "الموارد البشرية (HR)" : "Human Resources"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة شؤون الموظفين، الحضور، والرواتب" : "Manage staff, attendance, and payroll"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("directory")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "directory" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "دليل الموظفين" : "Employee Directory"}
          </button>
          <button 
            onClick={() => setActiveTab("attendance")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "attendance" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "الحضور والانصراف" : "Attendance"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
               {activeTab === "directory" ? (isAr ? "قائمة الموظفين" : "Employee List") : (isAr ? "سجل الحضور اليومي" : "Daily Attendance Log")}
             </h3>
             <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                {activeTab === "directory" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-100/50">
                        <tr>
                          <th className="px-4 py-3">{isAr ? "الموظف" : "Employee"}</th>
                          <th className="px-4 py-3">{isAr ? "الدور" : "Role"}</th>
                          <th className="px-4 py-3">{isAr ? "القسم" : "Department"}</th>
                          <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {systemUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-100/50 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {user.avatarInitials}
                                </div>
                                <div className="font-bold text-slate-800">{isAr ? user.nameAr : user.nameEn}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 capitalize">{user.role}</td>
                            <td className="px-4 py-3 text-slate-600">{user.department}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Active</span>
                            </td>
                          </tr>
                        ))}
                        {systemUsers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                              {isAr ? "لا توجد بيانات" : "No users found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-slate-500 font-bold mb-4">{isAr ? "البيانات تظهر هنا..." : "Data appears here..."}</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "أدوات وإجراءات" : "Tools & Actions"}</h3>
             <div className="space-y-3">
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <UserPlus className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "إضافة/تعديل موظف" : "Add/Edit Employee"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <CalendarDays className="w-5 h-5 text-emerald-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "جداول المناوبات (Rosters)" : "Shift Rosters"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <Clock className="w-5 h-5 text-amber-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "إدارة الإجازات" : "Leave Management"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <DollarSign className="w-5 h-5 text-emerald-600" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "مسير الرواتب (Payroll)" : "Payroll Processing"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <BarChart className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "تقييم الأداء" : "Performance Appraisal"}</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
