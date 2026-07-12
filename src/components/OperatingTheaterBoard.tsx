import React, { useState, useEffect } from "react";
import { Scissors, Activity, Users, Clock, CheckSquare, ShieldCheck, HeartPulse } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

interface Surgery {
  id: string;
  mrn: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  anesthesiologist: string;
  roomId: string;
  status: "Scheduled" | "In Progress" | "PACU" | "Transferred";
  timeSlot: string;
}

export default function OperatingTheaterBoard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"schedule" | "intraop" | "pacu">("schedule");
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);

  useEffect(() => {
    const unsub = syncSetting("his_surgeries", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setSurgeries(data.value);
      } else {
        const seeded: Surgery[] = [
          {
            id: "SURG-1",
            mrn: "MRN-2026-0041",
            patientName: "Omar Samir",
            procedure: "Appendectomy (Laparoscopic)",
            surgeon: "Dr. Khalid",
            anesthesiologist: "Dr. Hany",
            roomId: "OR-1",
            status: "In Progress",
            timeSlot: "08:00 - 11:30 AM"
          },
          {
            id: "SURG-2",
            mrn: "MRN-2026-0082",
            patientName: "Laila Ahmed",
            procedure: "Cholecystectomy",
            surgeon: "Dr. Tarek",
            anesthesiologist: "Dr. Samy",
            roomId: "OR-1",
            status: "Scheduled",
            timeSlot: "12:30 - 15:00 PM"
          }
        ];
        setSurgeries(seeded);
        saveSetting("his_surgeries", seeded);
      }
    });
    return () => unsub();
  }, []);

  const updateSurgeryStatus = async (id: string, newStatus: Surgery["status"]) => {
    const next = surgeries.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setSurgeries(next);
    await saveSetting("his_surgeries", next);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Status updated", titleAr: "تم تحديث الحالة", type: "form" } }));
    if (selectedSurgery?.id === id) {
      setSelectedSurgery({ ...selectedSurgery, status: newStatus });
    }
  };

  const handleSelectSurgery = (s: Surgery, tab: "intraop" | "pacu") => {
    setSelectedSurgery(s);
    setActiveTab(tab);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-rose-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Scissors className="h-7 w-7 text-rose-600" />
            {isAr ? "إدارة عمليات الجراحة (Operating Theater)" : "Operating Theater (OT)"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "جدولة الغرف، ملف العملية الجراحي، وتقرير الإفاقة (PACU)." : "OT Scheduling, Intra-Op Record, and PACU documentation."}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button onClick={() => setActiveTab("schedule")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "schedule" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Clock className="w-4 h-4" /> {isAr ? "جدولة العمليات" : "OT Schedule"}
          </button>
          <button disabled={!selectedSurgery} onClick={() => setActiveTab("intraop")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "intraop" ? "bg-white text-rose-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 disabled:opacity-50"}`}>
            <ShieldCheck className="w-4 h-4" /> {isAr ? "ملف الجراحة الداخلي" : "Intra-Op Record"}
          </button>
          <button disabled={!selectedSurgery} onClick={() => setActiveTab("pacu")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "pacu" ? "bg-white text-rose-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 disabled:opacity-50"}`}>
            <HeartPulse className="w-4 h-4" /> {isAr ? "الإفاقة (PACU)" : "PACU Chart"}
          </button>
        </div>
      </div>

      {activeTab === "schedule" && (
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {["OR-1", "OR-2", "OR-3"].map(roomId => {
                    const roomSurgeries = surgeries.filter(s => s.roomId === roomId && s.status !== "Transferred");
                    return (
                    <div key={roomId} className="border border-slate-200 rounded-xl overflow-hidden">
                       <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                          <span className="font-black text-sm">{roomId}</span>
                          <span className="text-[10px] bg-emerald-500 px-2 py-0.5 rounded font-bold">ACTIVE</span>
                       </div>
                       <div className="p-4 space-y-3">
                          {roomSurgeries.map(s => (
                            <div key={s.id} onClick={() => handleSelectSurgery(s, s.status === "PACU" ? "pacu" : "intraop")} className={`cursor-pointer transition border rounded-lg p-3 ${s.status === 'In Progress' ? 'bg-rose-50 border-rose-200' : s.status === 'PACU' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-black text-slate-800">{s.timeSlot}</span>
                                  <span className={`text-[10px] font-bold px-1 rounded ${s.status === 'In Progress' ? 'text-rose-600 bg-rose-200' : s.status === 'PACU' ? 'text-amber-700 bg-amber-200' : 'text-slate-500 bg-slate-200'}`}>{s.status}</span>
                               </div>
                               <p className="font-bold text-slate-800 text-sm">{s.procedure}</p>
                               <p className="text-[10px] text-slate-500 mt-1">Surgeon: {s.surgeon} | Anes: {s.anesthesiologist}</p>
                               <p className="text-[10px] text-slate-500 font-mono mt-1">{s.mrn} • {s.patientName}</p>
                            </div>
                          ))}
                          {roomSurgeries.length === 0 && (
                            <div className="text-center text-slate-400 font-bold py-4 text-xs">No surgeries scheduled</div>
                          )}
                       </div>
                    </div>
                 )})}
             </div>
         </div>
      )}

      {activeTab === "intraop" && selectedSurgery && (
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in flex flex-col md:flex-row gap-8">
             <div className="flex-1 space-y-6">
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center justify-between">
                   <div>
                      <p className="text-xs font-bold text-rose-800">{selectedSurgery.mrn} • {selectedSurgery.procedure}</p>
                      <h2 className="text-xl font-black text-rose-900 mt-1">{isAr ? "ملف العملية (Intra-Operative Record)" : "Intra-Op Master Record"}</h2>
                   </div>
                   <div className="text-right">
                      <span className="block text-[10px] text-rose-700 font-bold mb-1">Elapsed Time</span>
                      <span className="text-2xl font-mono font-black text-rose-600">01:45:22</span>
                   </div>
                </div>

                {selectedSurgery.status === "Scheduled" && (
                  <button onClick={() => updateSurgeryStatus(selectedSurgery.id, "In Progress")} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-sm transition">
                    Start Surgery (Move to In Progress)
                  </button>
                )}

                <div className="flex flex-wrap gap-2">
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Anesthesia Log", titleAr: "التخدير", type: "form" } }))} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg transition border border-slate-200">
                     {isAr ? "التخدير" : "Anesthesia"}
                   </button>
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Instruments Count", titleAr: "الأدوات المستخدمة", type: "form" } }))} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg transition border border-slate-200">
                     {isAr ? "الأدوات المستخدمة" : "Instruments Count"}
                   </button>
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Consumables Log", titleAr: "اللوازم المستهلكة", type: "form" } }))} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg transition border border-slate-200">
                     {isAr ? "اللوازم (Consumables)" : "Consumables"}
                   </button>
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Surgery Images", titleAr: "صور العملية", type: "form" } }))} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-lg transition border border-indigo-200">
                     {isAr ? "صور العملية" : "Surgery Images"}
                   </button>
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Operative Note", titleAr: "تقرير العملية (Op Note)", type: "form" } }))} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-lg transition border border-indigo-200">
                     {isAr ? "تقرير العملية (Op Note)" : "Op Note"}
                   </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition">
                      <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Anesthesia Start</p>
                      <p className="text-sm font-mono font-black text-slate-800 mt-1">08:15 AM</p>
                   </div>
                   <div className="border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-rose-500 transition">
                      <Scissors className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Surgical Incision</p>
                      <p className="text-sm font-mono font-black text-slate-800 mt-1">08:45 AM</p>
                   </div>
                   <div className="border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 transition">
                      <CheckSquare className="w-6 h-6 text-slate-400 mx-auto mb-2 text-indigo-500" />
                      <p className="text-xs font-bold text-slate-600">Surgery End</p>
                      <button className="mt-1 text-[10px] bg-slate-100 hover:bg-slate-200 font-bold px-3 py-1 rounded w-full">Record Time</button>
                   </div>
                </div>
             </div>

             <div className="w-full md:w-80 border-l border-slate-200 pl-8 space-y-4">
                <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" /> {isAr ? "قائمة أمان الجراحة (WHO Checklist)" : "WHO Safety Checklist"}
                </h3>
                <div className="space-y-3">
                   <label className="flex items-start gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                      <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                      Patient Identity, Site, and Procedure Verified
                   </label>
                   <label className="flex items-start gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                      <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                      Allergies checked (Sever Penicillin Alert active!)
                   </label>
                   <label className="flex items-start gap-2 text-xs font-bold text-slate-700 bg-white p-2 rounded border border-rose-300">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                      Sponge and Instrument counts correct (Closing phase)
                   </label>
                </div>
                <button onClick={() => updateSurgeryStatus(selectedSurgery.id, "PACU")} disabled={selectedSurgery.status !== "In Progress"} className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-lg transition">
                   {isAr ? "إنهاء الجراحة والنقل للإفاقة (PACU)" : "End Surgery & Move to PACU"}
                </button>
             </div>
         </div>
      )}

      {activeTab === "pacu" && selectedSurgery && (
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in text-center py-10">
            <HeartPulse className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h2 className="text-lg font-black text-slate-800">{isAr ? "تقرير الملاحظة ما بعد الإفاقة (PACU)" : "Post-Anesthesia Care Unit (PACU)"}</h2>
            <p className="text-sm font-bold text-slate-500 mt-1 mb-6">{selectedSurgery.patientName} - {selectedSurgery.procedure}</p>
            
            <div className="max-w-md mx-auto space-y-4 mb-8 text-left">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                 <span className="font-bold text-slate-700 text-sm">Aldrete Score</span>
                 <span className="font-black text-emerald-600 text-lg">9 / 10</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                 <span className="font-bold text-slate-700 text-sm">Pain Score</span>
                 <span className="font-black text-amber-600 text-lg">4 / 10</span>
              </div>
            </div>

            <button onClick={() => updateSurgeryStatus(selectedSurgery.id, "Transferred")} disabled={selectedSurgery.status !== "PACU"} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition">
               Authorize Discharge & Transfer to Ward
            </button>
         </div>
      )}
    </div>
  );
}
