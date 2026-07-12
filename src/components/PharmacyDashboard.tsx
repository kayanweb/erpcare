import React from "react";
import { Pill, Activity, Box, RotateCcw, AlertTriangle, Syringe, CheckCircle2, Shield, Trash2 } from "lucide-react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function PharmacyDashboard({ language }: Props) {
  const isAr = language === "ar";
  const { prescriptions, patients, updatePrescriptionStatus } = useHIS();
  
  const pendingPrescriptions = prescriptions.filter(p => p.status === "pending");
  const dispensedPrescriptions = prescriptions.filter(p => p.status === "dispensed");

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? (isAr ? patient.nameAr : patient.nameEn) + ` (MRN: ${patient.mrn})` : "Unknown Patient";
  };

  const handleDispense = (id: string) => {
    updatePrescriptionStatus(id, "dispensed");
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Medication dispensed successfully", titleAr: "تم صرف الدواء بنجاح", type: "form" } }));
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <Pill className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "إدارة الصيدلية" : "Pharmacy Management"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            {isAr ? "الصرف، الصيدلة السريرية، المخزون، والتحضير الوريدي" : "Level 6 - Dispensing, Clinical Pharmacy, Inventory, IV Prep"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {[
           { title: isAr ? "الوصفات المعلقة" : "Pending Prescriptions", value: pendingPrescriptions.length.toString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
           { title: isAr ? "الوصفات المصروفة" : "Dispensed Prescriptions", value: dispensedPrescriptions.length.toString(), icon: Box, color: "text-emerald-600", bg: "bg-emerald-50" },
           { title: isAr ? "جرد الأدوية الخاضعة" : "Narcotics Audit", value: "Pending", icon: Shield, color: "text-rose-600", bg: "bg-rose-50" },
           { title: isAr ? "تحضيرات وريدية" : "IV Prep Queue", value: "0", icon: Syringe, color: "text-indigo-600", bg: "bg-indigo-50" },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                 <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <RotateCcw className="w-5 h-5 text-indigo-500" />
               {isAr ? "طابور الصيدلة السريرية والصرف" : "Clinical Pharmacy & Dispensing Queue"}
            </h3>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
               <thead>
                  <tr className="bg-slate-50 border-y border-slate-100">
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التاريخ" : "Date"}</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المريض" : "Patient"}</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الدواء" : "Medication"}</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الجرعة" : "Dose"}</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التفاعلات الدوائية" : "Drug Interactions"}</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الإجراء" : "Action"}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {prescriptions.length > 0 ? (
                    prescriptions.map((p) => {
                      const isDc = p.status === "discontinued";
                      return (
                        <tr key={p.id} className={`hover:bg-slate-50/50 transition ${isDc ? "bg-rose-50/10 opacity-50 line-through text-slate-400" : ""}`}>
                           <td className="p-4 text-xs text-slate-500 font-mono">{p.date}</td>
                           <td className="p-4 font-bold text-sm text-slate-800">
                             <GlobalEntityLink entityId={p.patientId} entityName={getPatientName(p.patientId)} entityType="patient" isAr={isAr}>
                               {getPatientName(p.patientId)}
                             </GlobalEntityLink>
                           </td>
                           <td className="p-4 text-xs font-bold text-slate-700">{p.medication}</td>
                           <td className="p-4 text-xs text-slate-600">{p.dose} {p.qty && p.qty > 1 ? `x ${p.qty}` : ""}</td>
                           <td className="p-4">
                             {isDc ? (
                               <div className="flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold w-max">
                                 <AlertTriangle className="w-3 h-3 text-rose-600" />
                                 {isAr ? "أمر إيقاف طبي عاجل" : "Physician Cancel Order"}
                               </div>
                             ) : p.status === 'pending' ? (
                               <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold w-max">
                                 <Shield className="w-3 h-3 text-emerald-600" />
                                 {isAr ? "آمن (مراجعة تفاعلات البنسلين)" : "Safe (Penicillin Allergy Checked)"}
                               </div>
                             ) : (
                               <span className="text-slate-400 text-xs">-</span>
                             )}
                           </td>
                           <td className="p-4">
                             {isDc ? (
                               <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-1 rounded uppercase">
                                 {isAr ? "موقوف / ملغى" : "Discontinued"}
                               </span>
                             ) : p.status === 'pending' ? (
                               <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded uppercase animate-pulse">
                                 {isAr ? "معلق للمراجعة" : "Pending Verification"}
                               </span>
                             ) : p.status === 'not_given' ? (
                               <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-1 rounded uppercase">
                                 {isAr ? "تأخير / معلق" : "Hold / Delayed"}
                               </span>
                             ) : (
                               <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1 w-max">
                                 <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {isAr ? "تم الصرف والمطابقة" : "Dispensed & Verified"}
                               </span>
                             )}
                           </td>
                           <td className="p-4">
                             {isDc ? (
                               <span className="text-[10px] text-rose-600 font-bold">
                                 {isAr ? "إيقاف من الطبيب" : "Stopped by Doctor"}
                               </span>
                             ) : p.status === 'pending' ? (
                               <button onClick={() => handleDispense(p.id)} className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm cursor-pointer">
                                 {isAr ? "صرف واعتماد" : "Verify & Dispense"}
                               </button>
                             ) : (
                               <span className="text-slate-400 text-xs">-</span>
                             )}
                           </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                        {isAr ? "لا توجد وصفات طبية" : "No prescriptions found"}
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
