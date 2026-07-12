cat << 'INNER_EOF' > src/components/HRDashboard.tsx
import React, { useState } from "react";
import { Users, UserPlus, Clock, DollarSign, Calendar, FileText, Search, Filter, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function HRDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"directory" | "attendance" | "payroll" | "leaves">("directory");

  const employees = [
    { id: "EMP-001", name: "Dr. Ahmed Hassan", role: "Cardiologist", dept: "Cardiology", status: "Active" },
    { id: "EMP-002", name: "Sarah Smith", role: "Head Nurse", dept: "ICU", status: "Active" },
    { id: "EMP-003", name: "Mohammed Ali", role: "Receptionist", dept: "Front Office", status: "On Leave" }
  ];

  const attendance = [
    { id: "EMP-001", name: "Dr. Ahmed Hassan", date: "2023-10-25", checkIn: "08:00 AM", checkOut: "04:30 PM", status: "Present" },
    { id: "EMP-002", name: "Sarah Smith", date: "2023-10-25", checkIn: "07:45 AM", checkOut: "04:00 PM", status: "Present" },
    { id: "EMP-003", name: "Mohammed Ali", date: "2023-10-25", checkIn: "-", checkOut: "-", status: "Absent" }
  ];

  const payroll = [
    { id: "EMP-001", name: "Dr. Ahmed Hassan", month: "October 2023", basic: 25000, allowances: 5000, deductions: 1000, net: 29000, status: "Pending" },
    { id: "EMP-002", name: "Sarah Smith", month: "October 2023", basic: 12000, allowances: 2000, deductions: 500, net: 13500, status: "Pending" },
  ];

  const leaves = [
    { id: "LV-001", name: "Mohammed Ali", type: "Annual Leave", from: "2023-10-20", to: "2023-10-30", status: "Approved" },
    { id: "LV-002", name: "Dr. Laila", type: "Sick Leave", from: "2023-10-25", to: "2023-10-26", status: "Pending" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1.5 rounded-xl" />
            {isAr ? "الموارد البشرية" : "Human Resources"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة الموظفين، الحضور، الرواتب والإجازات" : "Manage employees, attendance, payroll and leaves"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "directory", labelAr: "دليل الموظفين", labelEn: "Directory", icon: Users },
          { id: "attendance", labelAr: "الحضور والانصراف", labelEn: "Attendance", icon: Clock },
          { id: "payroll", labelAr: "مسير الرواتب", labelEn: "Payroll", icon: DollarSign },
          { id: "leaves", labelAr: "الإجازات", labelEn: "Leaves", icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-indigo-100 text-indigo-700"
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
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-indigo-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
              <Filter className="w-5 h-5" />
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm">
              <UserPlus className="w-4 h-4" />
              {isAr ? "إضافة" : "Add"}
            </button>
          </div>
        </div>

        {activeTab === "directory" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "رقم الموظف" : "Emp ID"}</th>
                  <th className="px-4 py-3">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3">{isAr ? "المسمى الوظيفي" : "Role"}</th>
                  <th className="px-4 py-3">{isAr ? "القسم" : "Department"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{e.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{e.name}</td>
                    <td className="px-4 py-3 text-slate-600">{e.role}</td>
                    <td className="px-4 py-3 text-slate-600">{e.dept}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${e.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                  <th className="px-4 py-3">{isAr ? "وقت الدخول" : "Check In"}</th>
                  <th className="px-4 py-3">{isAr ? "وقت الخروج" : "Check Out"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="px-4 py-3 text-slate-600">{a.date}</td>
                    <td className="px-4 py-3 text-slate-600">{a.checkIn}</td>
                    <td className="px-4 py-3 text-slate-600">{a.checkOut}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "payroll" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3">{isAr ? "الشهر" : "Month"}</th>
                  <th className="px-4 py-3">{isAr ? "الأساسي" : "Basic"}</th>
                  <th className="px-4 py-3">{isAr ? "البدلات" : "Allowances"}</th>
                  <th className="px-4 py-3">{isAr ? "الاستقطاعات" : "Deductions"}</th>
                  <th className="px-4 py-3">{isAr ? "الصافي" : "Net Salary"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payroll.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.month}</td>
                    <td className="px-4 py-3 text-slate-600">{p.basic.toLocaleString()} SAR</td>
                    <td className="px-4 py-3 text-slate-600">{p.allowances.toLocaleString()} SAR</td>
                    <td className="px-4 py-3 text-rose-600">{p.deductions.toLocaleString()} SAR</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{p.net.toLocaleString()} SAR</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "leaves" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "رقم الطلب" : "Request ID"}</th>
                  <th className="px-4 py-3">{isAr ? "الموظف" : "Employee"}</th>
                  <th className="px-4 py-3">{isAr ? "النوع" : "Type"}</th>
                  <th className="px-4 py-3">{isAr ? "من" : "From"}</th>
                  <th className="px-4 py-3">{isAr ? "إلى" : "To"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-4 py-3 text-center">{isAr ? "إجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{l.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{l.name}</td>
                    <td className="px-4 py-3 text-slate-600">{l.type}</td>
                    <td className="px-4 py-3 text-slate-600">{l.from}</td>
                    <td className="px-4 py-3 text-slate-600">{l.to}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex items-center justify-center gap-2">
                         {l.status === 'Pending' && (
                           <>
                             <button className="text-emerald-600 hover:text-emerald-800"><CheckCircle2 className="w-5 h-5"/></button>
                             <button className="text-rose-600 hover:text-rose-800"><XCircle className="w-5 h-5"/></button>
                           </>
                         )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
INNER_EOF
