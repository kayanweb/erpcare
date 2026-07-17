import React, { useState } from "react";
import { Video, Calendar, Plus, Search, Users, User, Activity, Clock, PlayCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function LiveConsultationDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"consultations" | "meetings">("consultations");

  const sessions = [
    { id: 1, title: "Cardiology Follow-up", patient: "Ahmed Ali", doctor: "Dr. Sarah", time: "10:30 AM", duration: "30 min", status: "Starting Soon" },
    { id: 2, title: "Initial Consultation", patient: "Mona Hassan", doctor: "Dr. Khaled", time: "01:00 PM", duration: "45 min", status: "Scheduled" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600 bg-blue-100 p-1.5 rounded-xl" />
            {isAr ? "الاستشارات المرئية" : "Live Consultation"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة الاستشارات المرئية للمرضى واجتماعات الموظفين" : "Manage patient live consultations and staff meetings"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "consultations", labelAr: "استشارات المرضى", labelEn: "Live Consultations", icon: Video },
          { id: "meetings", labelAr: "اجتماعات الموظفين", labelEn: "Live Meetings", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700"
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
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-blue-500 outline-none transition`}
            />
          </div>
          <button
            onClick={() => toast.success(isAr ? "تم فتح نافذة الإضافة" : "Add modal opened")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "جدولة جلسة" : "Schedule Session"}
          </button>
        </div>

        {activeTab === "consultations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {sessions.map(s => (
               <div key={s.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden hover:shadow-lg transition group">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                   <div>
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold inline-block mb-2 ${s.status === 'Starting Soon' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                       {s.status}
                     </span>
                     <h3 className="font-bold text-slate-800 text-lg leading-tight">{s.title}</h3>
                   </div>
                   <button className="text-slate-400 hover:text-slate-700"><MoreHorizontal className="w-5 h-5"/></button>
                 </div>
                 <div className="p-4 bg-slate-50 space-y-2">
                   <p className="text-sm text-slate-600 flex items-center gap-2"><User className="w-4 h-4 text-slate-400"/> {s.patient}</p>
                   <p className="text-sm text-slate-600 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400"/> {s.doctor}</p>
                   <p className="text-sm text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400"/> {s.time} ({s.duration})</p>
                 </div>
                 <div className="p-4 border-t border-slate-100">
                   <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm transition">
                     <PlayCircle className="w-4 h-4"/> {isAr ? "بدء الجلسة" : "Join Session"}
                   </button>
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "اجتماعات الموظفين" : "Staff Live Meetings"}</h3>
            <p className="text-slate-500">{isAr ? "لا توجد اجتماعات مجدولة حالياً" : "No meetings scheduled right now"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
