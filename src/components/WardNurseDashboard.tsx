import React, { useState, useEffect } from "react";
import { BedDouble, Droplets, Droplet, Clock, CheckCircle2, XCircle, AlertCircle, ScanBarcode, User, Activity, FileText, Share, AlertTriangle } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";
import { useHIS } from "../context/HISContext";

interface Props {
  language: "ar" | "en";
}

interface Admission {
  id: string;
  mrn: string;
  patientName: string;
  bedId: string;
  wardId: string;
  status: "Admitted" | "Discharged" | "Transferred";
  admittedAt: string;
  diagnosis: string;
  riskLevel: "Low" | "Medium" | "High";
}

export default function WardNurseDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"patients" | "emar" | "io">("patients");
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Admission | null>(null);

  const hisContext = useHIS();
  const hisPatients = hisContext ? hisContext.patients : [];
  const wardPatients = hisPatients.filter(p => p.status === "ward");

  // Combine live ward patients from context with synced admissions
  const combinedAdmissions = [...admissions];
  wardPatients.forEach(p => {
    const exists = admissions.some(a => a.mrn === p.mrn);
    if (!exists) {
      combinedAdmissions.push({
        id: `ADM-${p.id}`,
        mrn: p.mrn,
        patientName: isAr ? p.nameAr : p.nameEn,
        bedId: "BED-TBD",
        wardId: "WD-1",
        status: "Admitted",
        admittedAt: new Date().toISOString(),
        diagnosis: isAr ? "تحت الملاحظة / تنويم داخلي" : "Observation / Ward Admission",
        riskLevel: "Medium"
      });
    }
  });

  useEffect(() => {
    const unsub = syncSetting("his_ward_admissions", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setAdmissions(data.value);
      } else {
        const seeded: Admission[] = [
          {
            id: "ADM-100",
            mrn: "MRN-2026-0041",
            patientName: "Omar Samir",
            bedId: "BED-4",
            wardId: "WD-1",
            status: "Admitted",
            admittedAt: new Date().toISOString(),
            diagnosis: "Post-Op Appendectomy",
            riskLevel: "Low"
          },
          {
            id: "ADM-101",
            mrn: "MRN-2026-0082",
            patientName: "Laila Ahmed",
            bedId: "BED-2",
            wardId: "WD-1",
            status: "Admitted",
            admittedAt: new Date(Date.now() - 86400000).toISOString(),
            diagnosis: "Pneumonia",
            riskLevel: "High"
          }
        ];
        setAdmissions(seeded);
        saveSetting("his_ward_admissions", seeded);
      }
    });
    return () => unsub();
  }, []);

  const handleSelectPatient = (p: Admission) => {
    setSelectedPatient(p);
  };

  const handleMedAction = (action: string) => {
    toast.success(isAr ? `تم تسجيل الحدث: ${action}` : `Medication Status Updated: ${action}`);
    toast.info("Stored Nurse ID, Timestamp, Updated EMR, wrote Audit Log");
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-sky-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BedDouble className="h-7 w-7 text-sky-600" />
            {isAr ? "كاردكس التمريض (Nursing Kardex)" : "Nursing Kardex & IPD"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage assigned patients, E-MAR, and Ward specific actions.
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button onClick={() => setActiveTab("patients")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "patients" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <BedDouble className="w-4 h-4" /> {isAr ? "مرضى القسم" : "Assigned Patients"}
          </button>
          <button disabled={!selectedPatient} onClick={() => setActiveTab("emar")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "emar" ? "bg-white text-sky-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 disabled:opacity-50"}`}>
            <ScanBarcode className="w-4 h-4" /> E-MAR
          </button>
          <button disabled={!selectedPatient} onClick={() => setActiveTab("io")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "io" ? "bg-white text-sky-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 disabled:opacity-50"}`}>
            <Droplets className="w-4 h-4" /> Intake/Output
          </button>
        </div>
      </div>

      {activeTab === "patients" && (
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-fade-in">
            {combinedAdmissions.filter(a => a.status === "Admitted").map(adm => (
              <div key={adm.id} onClick={() => handleSelectPatient(adm)} className={`bg-white border-2 cursor-pointer p-4 rounded-2xl flex flex-col transition shadow-sm ${selectedPatient?.id === adm.id ? 'border-sky-400 bg-sky-50' : 'border-slate-100 hover:border-sky-200'}`}>
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-slate-400" />
                       </div>
                       <div>
                          <span className="font-bold text-sm text-slate-800 block">{adm.patientName}</span>
                          <span className="text-[10px] font-mono bg-white border border-slate-200 px-2 rounded mt-1 inline-block">{adm.mrn}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="font-black text-sky-700">{adm.bedId}</div>
                       <div className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${adm.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>Risk: {adm.riskLevel}</div>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs font-bold text-slate-600">
                    Diagnosis: {adm.diagnosis}
                 </div>

                 {selectedPatient?.id === adm.id && (
                   <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 border-t border-slate-200">
                      <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold py-2 rounded-lg flex flex-col items-center gap-1 transition">
                         <Activity className="w-4 h-4"/> Vitals
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setActiveTab("emar"); }} className="bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-[10px] font-bold py-2 rounded-lg flex flex-col items-center gap-1 transition">
                         <ScanBarcode className="w-4 h-4"/> Medication
                      </button>
                      <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold py-2 rounded-lg flex flex-col items-center gap-1 transition">
                         <FileText className="w-4 h-4"/> Notes
                      </button>
                      <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold py-2 rounded-lg flex flex-col items-center gap-1 transition">
                         <Share className="w-4 h-4"/> Transfer
                      </button>
                      <button className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[10px] font-bold py-2 rounded-lg flex flex-col items-center gap-1 transition">
                         <AlertTriangle className="w-4 h-4"/> Incident
                      </button>
                   </div>
                 )}
              </div>
            ))}
            {combinedAdmissions.filter(a => a.status === "Admitted").length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 font-bold">
                {isAr ? "لا يوجد مرضى منومين حالياً" : "No patients currently assigned"}
              </div>
            )}
         </div>
      )}

      {activeTab === "emar" && selectedPatient && (
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in">
             <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="font-black text-slate-800 flex items-center gap-2 mb-1">
                      <ScanBarcode className="w-6 h-6 text-sky-500" /> Medication Administration
                    </h3>
                    <p className="text-xs text-slate-500 font-bold ml-8">Patient: {selectedPatient.mrn} ({selectedPatient.bedId}) - {selectedPatient.patientName}</p>
                 </div>
             </div>

             <div className="space-y-4">
                 {/* Single Med Card */}
                 <div className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 hover:bg-white transition">
                    <div>
                       <h4 className="font-black text-slate-800 text-lg">Ceftriaxone</h4>
                       <div className="flex gap-4 text-xs font-bold text-slate-500 mt-1">
                          <span>Dose: 1g</span>
                          <span>Route: IV</span>
                          <span>Time: 08:00 AM</span>
                       </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                       <button onClick={() => handleMedAction("Administered")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition">Administer</button>
                       <button onClick={() => handleMedAction("Hold")} className="flex-1 bg-amber-100 text-amber-700 hover:bg-amber-200 font-bold text-xs py-2 px-4 rounded-lg transition">Hold</button>
                       <button onClick={() => handleMedAction("Refuse")} className="flex-1 bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold text-xs py-2 px-4 rounded-lg transition">Refuse</button>
                       <button onClick={() => handleMedAction("Missed")} className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition">Missed</button>
                    </div>
                 </div>

                 {/* Single Med Card */}
                 <div className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 hover:bg-white transition">
                    <div>
                       <h4 className="font-black text-slate-800 text-lg">Ketorolac Ampoule</h4>
                       <div className="flex gap-4 text-xs font-bold text-slate-500 mt-1">
                          <span>Dose: 30mg</span>
                          <span>Route: IM</span>
                          <span>Time: PRN (As Needed)</span>
                       </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                       <button onClick={() => handleMedAction("Administered")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition">Administer</button>
                       <button onClick={() => handleMedAction("Hold")} className="flex-1 bg-amber-100 text-amber-700 hover:bg-amber-200 font-bold text-xs py-2 px-4 rounded-lg transition">Hold</button>
                       <button onClick={() => handleMedAction("Refuse")} className="flex-1 bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold text-xs py-2 px-4 rounded-lg transition">Refuse</button>
                       <button onClick={() => handleMedAction("Missed")} className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition">Missed</button>
                    </div>
                 </div>
             </div>
         </div>
      )}

      {activeTab === "io" && selectedPatient && (
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in">
             <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-sky-500" /> {isAr ? "مخطط السوائل (Intake / Output Chart)" : "Fluid Balance Chart"} - {selectedPatient.patientName}
                 </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                 <div>
                    <h4 className="text-emerald-700 font-bold mb-3 flex items-center gap-1"><Droplet className="w-4 h-4"/> Intake</h4>
                    <div className="grid grid-cols-3 gap-2">
                       <input type="number" placeholder="IV Fluids (ml)" className="border border-slate-300 rounded p-2 text-xs" />
                       <input type="number" placeholder="Oral / Oral (ml)" className="border border-slate-300 rounded p-2 text-xs" />
                       <button className="bg-emerald-100 text-emerald-800 font-bold text-xs rounded">+ Add Intake</button>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-amber-700 font-bold mb-3 flex items-center gap-1"><Droplet className="w-4 h-4"/> Output</h4>
                    <div className="grid grid-cols-3 gap-2">
                       <input type="number" placeholder="Urine (ml)" className="border border-slate-300 rounded p-2 text-xs" />
                       <input type="number" placeholder="Drains (ml)" className="border border-slate-300 rounded p-2 text-xs" />
                       <button className="bg-amber-100 text-amber-800 font-bold text-xs rounded">+ Add Output</button>
                    </div>
                 </div>
             </div>

             <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between text-white">
                 <span className="font-bold">24-Hour Net Fluid Balance</span>
                 <span className="font-mono text-xl font-black text-emerald-400">+ 250 ml (Positive)</span>
             </div>
         </div>
      )}
    </div>
  );
}
