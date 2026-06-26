import React, { useState } from "react";
import { 
  Baby, CalendarHeart, HeartPulse, Stethoscope, 
  AlertTriangle, FileText, Activity, Clock
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function ObstetricsDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"prenatal" | "delivery">("prenatal");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Baby className="w-7 h-7 text-pink-500" />
            {isAr ? "قسم النساء والولادة (Obstetrics)" : "Obstetrics & Gynecology"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "متابعة الحمل، السونار، وإجراءات الولادة" : "Prenatal care, ultrasound, and delivery"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("prenatal")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "prenatal" ? "bg-pink-50 text-pink-700 border-b-2 border-pink-500" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "متابعة الحمل" : "Prenatal Care"}
          </button>
          <button 
            onClick={() => setActiveTab("delivery")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "delivery" ? "bg-pink-50 text-pink-700 border-b-2 border-pink-500" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "غرفة الولادة" : "Delivery Room"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
               {activeTab === "prenatal" ? (isAr ? "المرضى في متابعة الحمل" : "Prenatal Patients") : (isAr ? "المرضى في غرفة الولادة" : "Patients in Labor")}
             </h3>
             <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500 font-bold mb-4">{isAr ? "قائمة المرضى تظهر هنا..." : "Patient list appears here..."}</p>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm">
                  {isAr ? "إضافة مريضة جديدة" : "Add New Patient"}
                </button>
             </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "أدوات وإجراءات" : "Tools & Actions"}</h3>
             <div className="space-y-3">
               {activeTab === "prenatal" && (
                 <>
                   <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                     <CalendarHeart className="w-5 h-5 text-pink-500" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "تسجيل حمل جديد" : "New Pregnancy Record"}</span>
                   </button>
                   <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                     <Activity className="w-5 h-5 text-indigo-500" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "السونار والتقييم" : "Ultrasound & Assessment"}</span>
                   </button>
                   <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                     <Clock className="w-5 h-5 text-emerald-500" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "تحديد موعد الولادة (EDD)" : "Calculate EDD"}</span>
                   </button>
                 </>
               )}
               {activeTab === "delivery" && (
                 <>
                   <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl flex items-center gap-3 transition border border-rose-200">
                     <AlertTriangle className="w-5 h-5" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "تسجيل الولادة والمضاعفات" : "Log Delivery & Complications"}</span>
                   </button>
                   <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                     <HeartPulse className="w-5 h-5 text-pink-500" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "حالة الأم (بعد الولادة)" : "Maternal Postpartum Status"}</span>
                   </button>
                   <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                     <Stethoscope className="w-5 h-5 text-indigo-500" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "حالة المولود (أبغار)" : "Neonate Status (Apgar)"}</span>
                   </button>
                   <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-3 rounded-xl flex items-center gap-3 transition border border-emerald-200">
                     <Baby className="w-5 h-5" />
                     <span className="text-sm font-bold text-left flex-1">{isAr ? "تسجيل المولود بالمستشفى" : "Register Newborn File"}</span>
                   </button>
                 </>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
