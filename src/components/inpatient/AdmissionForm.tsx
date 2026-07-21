import React, { useState } from "react";
import { User, Shield, Stethoscope, Bed, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdmissionForm({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isAr ? "تم تسجيل طلب الدخول بنجاح" : "Admission request registered successfully");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isAr ? "طلب تنويم مريض جديد" : "Inpatient Admission Request"}</h2>
           <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "تسجيل البيانات الإدارية والسريرية للدخول" : "Register administrative & clinical data for ward entry"}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
           <Shield className="w-4 h-4" />
           {isAr ? "طلب مؤمن" : "Secure Request"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Selection & Administrative */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{isAr ? "البيانات الإدارية والتعريفية" : "Administrative & Identity Data"}</h3>
           </div>
           <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "البحث عن مريض (اسم/رقم طبي)" : "Search Patient (Name/MRN)"}</label>
                 <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 pl-14 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all focus:bg-white" placeholder="Search..." />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "نوع الدخول" : "Admission Type"}</label>
                 <select required className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all focus:bg-white appearance-none">
                    <option value="elective">{isAr ? "اختياري" : "Elective"}</option>
                    <option value="emergency">{isAr ? "طوارئ" : "Emergency"}</option>
                    <option value="transfer">{isAr ? "تحويل خارجي" : "External Transfer"}</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Clinical Data */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{isAr ? "المعطيات السريرية للدخول" : "Clinical Admission Justification"}</h3>
           </div>
           <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "التشخيص المبدئي" : "Provisional Diagnosis"}</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all focus:bg-white" placeholder="ICD-10 Code or Description" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الطبيب المعالج" : "Attending Physician"}</label>
                    <select required className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all focus:bg-white appearance-none">
                       <option>Select Consultant...</option>
                       <option>Dr. Sarah Ahmed (Internal Med)</option>
                       <option>Dr. Khalid Omar (Surgical)</option>
                    </select>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "أوامر الدخول الفورية" : "Immediate Admission Orders"}</label>
                 <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all focus:bg-white resize-none" placeholder="NPO, Vitals, Stat labs..."></textarea>
              </div>
           </div>
        </div>

        {/* Bed & Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl p-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                 <Bed className="w-5 h-5 text-indigo-600" />
                 <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{isAr ? "تخصيص السرير" : "Bed Allocation"}</h3>
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "نوع الجناح" : "Accomodation Class"}</label>
                 <select required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all">
                    <option value="standard">Standard Shared</option>
                    <option value="private">Private Room</option>
                    <option value="vip">VIP Suite</option>
                 </select>
              </div>
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-[24px] flex items-start gap-4">
                 <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                 <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">
                   {isAr ? "تنبيه: الجناح الخاص غير متوفر حالياً، سيتم وضع المريض في قائمة الانتظار" : "Note: Private rooms currently at capacity. Patient will be prioritized on waitlist if selected."}
                 </p>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl p-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                 <Shield className="w-5 h-5 text-indigo-600" />
                 <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{isAr ? "الضمان المالي" : "Financial Clearance"}</h3>
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "جهة الدفع" : "Payor Source"}</label>
                 <select required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all">
                    <option value="insurance">Private Insurance</option>
                    <option value="cash">Self-Pay / Cash</option>
                    <option value="government">Government Coverage</option>
                 </select>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                 <CheckCircle2 className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Eligibility Verified</span>
              </div>
           </div>
        </div>

        <div className="flex justify-end gap-4 pt-8">
           <button type="button" className="px-10 py-5 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors">
              {isAr ? "إلغاء الطلب" : "Discard"}
           </button>
           <button disabled={isSubmitting} type="submit" className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-16 py-5 rounded-[24px] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-4">
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
              <span className="text-lg">{isAr ? "إرسال طلب الدخول" : "Confirm Admission"}</span>
           </button>
        </div>
      </form>
    </div>
  );
}
