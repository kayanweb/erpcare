import React, { useState } from "react";
import { 
  Home, Calendar, History as HistoryIcon, Pill, FileText, 
  User, CheckCircle2, AlertCircle, Clock, Stethoscope 
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  departments?: string[];
  systemUsers?: any[];
}

export default function PatientPortalDashboard({ language, departments = [], systemUsers = [] }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"home" | "booking" | "history">("home");

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-indigo-700 text-white p-4 sm:p-6 border-b border-indigo-800 shrink-0">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <User className="w-7 h-7 text-indigo-200" />
          {isAr ? "بوابة المريض" : "Patient Portal"}
        </h1>
        <p className="text-sm text-indigo-200 font-medium mt-1">
          {isAr ? "مرحباً بك، أحمد محمد. يمكنك متابعة حالتك الصحية وحجز المواعيد من هنا." : "Welcome, Ahmed Mohamed. Track your health and book appointments here."}
        </p>

        <div className="flex mt-6 gap-6">
          <button 
            onClick={() => setActiveTab("home")}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === "home" ? "text-white border-b-2 border-white" : "text-indigo-300 hover:text-white"}`}
          >
            <Home className="w-4 h-4" /> {isAr ? "الرئيسية" : "Home"}
          </button>
          <button 
            onClick={() => setActiveTab("booking")}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === "booking" ? "text-white border-b-2 border-white" : "text-indigo-300 hover:text-white"}`}
          >
            <Calendar className="w-4 h-4" /> {isAr ? "حجز موعد" : "Booking"}
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === "history" ? "text-white border-b-2 border-white" : "text-indigo-300 hover:text-white"}`}
          >
            <HistoryIcon className="w-4 h-4" /> {isAr ? "السجل الطبي" : "Medical History"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {activeTab === "home" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                 <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                   <Calendar className="w-5 h-5 text-indigo-500" /> {isAr ? "المواعيد القادمة" : "Upcoming Appointments"}
                 </h3>
                 <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{isAr ? "عيادة القلب" : "Cardiology Clinic"}</p>
                          <p className="text-xs text-slate-600">Dr. Sarah Ahmed</p>
                       </div>
                       <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-indigo-800 font-bold mt-3">
                       <Clock className="w-4 h-4" /> 15 Oct 2024, 10:00 AM
                    </div>
                 </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                 <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                   <Pill className="w-5 h-5 text-teal-500" /> {isAr ? "الأدوية الحالية" : "Current Medications"}
                 </h3>
                 <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                       <p className="font-bold text-slate-800 text-sm">Aspirin 81mg</p>
                       <p className="text-xs text-slate-600 mt-1">{isAr ? "قرص واحد يومياً بعد الإفطار" : "1 tablet daily after breakfast"}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                       <p className="font-bold text-slate-800 text-sm">Atorvastatin 20mg</p>
                       <p className="text-xs text-slate-600 mt-1">{isAr ? "قرص واحد مساءً" : "1 tablet in the evening"}</p>
                    </div>
                 </div>
              </div>

              {/* Recent Lab Results */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                 <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-rose-500" /> {isAr ? "أحدث نتائج التحاليل" : "Recent Lab Results"}
                 </h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-3">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">CBC (Complete Blood Count)</p>
                          <p className="text-xs text-slate-500 mt-1">10 Oct 2024</p>
                       </div>
                       <button className="text-indigo-600 hover:text-indigo-700 text-[10px] font-bold underline">
                          {isAr ? "عرض النتيجة" : "View"}
                       </button>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-3">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Lipid Profile</p>
                          <p className="text-xs text-slate-500 mt-1">10 Oct 2024</p>
                       </div>
                       <div className="flex items-center gap-1 text-rose-600 text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3" /> {isAr ? "عالي" : "High"}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "booking" && (
           <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500" /> {isAr ? "حجز موعد جديد" : "Book New Appointment"}
                 </h3>
              </div>
              <div className="p-6 flex-1 space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{isAr ? "التخصص" : "Specialty"}</label>
                    <select className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none bg-slate-50">
                       <option>{isAr ? "الرجاء الاختيار..." : "Please Select..."}</option>
                       {departments.length > 0 ? departments.map((dept, i) => (
                           <option key={i} value={dept}>{dept}</option>
                        )) : (
                          <>
                            <option>{isAr ? "باطنة" : "Internal Medicine"}</option>
                            <option>{isAr ? "قلب" : "Cardiology"}</option>
                            <option>{isAr ? "عظام" : "Orthopedics"}</option>
                          </>
                        )}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{isAr ? "الطبيب" : "Doctor"}</label>
                    <select className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none bg-slate-50" disabled>
                       <option>{isAr ? "الرجاء اختيار التخصص أولاً" : "Select specialty first"}</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{isAr ? "التاريخ" : "Date"}</label>
                       <input type="date" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none bg-slate-50" />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{isAr ? "الوقت المتاح" : "Available Slots"}</label>
                       <select className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none bg-slate-50" disabled>
                          <option>{isAr ? "-" : "-"}</option>
                       </select>
                    </div>
                 </div>
                 <button onClick={() => toast.success(isAr ? "تم إرسال طلب الحجز" : "Booking Request Sent")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-sm transition mt-4">
                    {isAr ? "تأكيد الحجز" : "Confirm Booking"}
                 </button>
              </div>
           </div>
        )}

        {activeTab === "history" && (
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5 text-indigo-500" /> {isAr ? "زياراتك السابقة وتقارير الخروج" : "Past Visits & Discharge Summaries"}
                 </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <Stethoscope className="w-4 h-4 text-slate-500" />
                          <span className="font-bold text-slate-800 text-sm">Consultation - Cardiology</span>
                       </div>
                       <p className="text-xs text-slate-500">Dr. Sarah Ahmed • 15 Sep 2024</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded transition">
                          {isAr ? "تقرير الزيارة" : "Visit Note"}
                       </button>
                       <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded transition">
                          {isAr ? "وصفة طبية" : "Prescription"}
                       </button>
                    </div>
                 </div>

                 <div className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-slate-800 text-sm">Inpatient Admission - Internal Medicine</span>
                       </div>
                       <p className="text-xs text-slate-500">Discharged: 10 Aug 2024</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold px-3 py-1.5 rounded transition">
                          {isAr ? "ملخص الخروج (Discharge Summary)" : "Discharge Summary"}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
