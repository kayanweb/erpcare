import React, { useState } from "react";
import { Users, Phone, Mail, BookOpen, AlertCircle, Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function FrontOfficeDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"appointments" | "visitors" | "call_log" | "postal" | "complain">("appointments");

  const visitors = [
    { id: "V001", name: "Ahmed Ali", purpose: "Visit Patient", phone: "0501234567", date: "2023-10-25", inTime: "10:00 AM", outTime: "11:30 AM" },
    { id: "V002", name: "Sara Khan", purpose: "Meeting HR", phone: "0509876543", date: "2023-10-25", inTime: "11:15 AM", outTime: "12:00 PM" },
  ];

  const calls = [
    { id: "C001", name: "Dr. Smith", phone: "0501112233", date: "2023-10-25", description: "Follow up on patient status", type: "Incoming" },
    { id: "C002", name: "Jane Doe", phone: "0504445566", date: "2023-10-25", description: "Appointment inquiry", type: "Incoming" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1.5 rounded-xl" />
            {isAr ? "المكتب الأمامي" : "Front Office"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة المواعيد، الزوار، المكالمات، البريد والشكاوى" : "Manage appointments, visitors, calls, postal and complaints"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "appointments", labelAr: "المواعيد", labelEn: "Appointments", icon: BookOpen },
          { id: "visitors", labelAr: "سجل الزوار", labelEn: "Visitor Book", icon: Users },
          { id: "call_log", labelAr: "سجل المكالمات", labelEn: "Call Log", icon: Phone },
          { id: "postal", labelAr: "البريد", labelEn: "Postal", icon: Mail },
          { id: "complain", labelAr: "الشكاوى", labelEn: "Complain", icon: AlertCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
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
            <button
              onClick={() => toast.success(isAr ? "تم فتح نافذة الإضافة" : "Add modal opened")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إضافة" : "Add New"}
            </button>
          </div>
        </div>

        {activeTab === "appointments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "اسم المريض" : "Patient Name"}</th>
                  <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                  <th className="px-4 py-3">{isAr ? "الطبيب" : "Doctor"}</th>
                  <th className="px-4 py-3">{isAr ? "القسم" : "Department"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">Omar Hassan</td>
                  <td className="px-4 py-3 text-slate-600">2023-10-25 09:30 AM</td>
                  <td className="px-4 py-3 text-slate-600">Dr. Sarah Smith</td>
                  <td className="px-4 py-3 text-slate-600">Cardiology</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Waiting</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "visitors" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "الزائر" : "Visitor"}</th>
                  <th className="px-4 py-3">{isAr ? "الغرض" : "Purpose"}</th>
                  <th className="px-4 py-3">{isAr ? "الهاتف" : "Phone"}</th>
                  <th className="px-4 py-3">{isAr ? "وقت الدخول" : "In Time"}</th>
                  <th className="px-4 py-3">{isAr ? "وقت الخروج" : "Out Time"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{v.name}</td>
                    <td className="px-4 py-3 text-slate-600">{v.purpose}</td>
                    <td className="px-4 py-3 text-slate-600">{v.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{v.inTime}</td>
                    <td className="px-4 py-3 text-slate-600">{v.outTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "call_log" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "المتصل" : "Caller"}</th>
                  <th className="px-4 py-3">{isAr ? "الهاتف" : "Phone"}</th>
                  <th className="px-4 py-3">{isAr ? "النوع" : "Type"}</th>
                  <th className="px-4 py-3">{isAr ? "الوصف" : "Description"}</th>
                  <th className="px-4 py-3">{isAr ? "الإجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calls.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3 text-slate-600"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{c.type}</span></td>
                    <td className="px-4 py-3 text-slate-600">{c.description}</td>
                    <td className="px-4 py-3">
                      <button className="text-slate-400 hover:text-indigo-600"><MoreHorizontal className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "postal" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "البريد الوارد والصادر" : "Postal Receive/Dispatch"}</h3>
            <p className="text-slate-500">{isAr ? "لا يوجد بريد مسجل" : "No postal records"}</p>
          </div>
        )}

        {activeTab === "complain" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "الشكاوى" : "Complaints"}</h3>
            <p className="text-slate-500">{isAr ? "لا توجد شكاوى مسجلة" : "No complaints recorded"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
