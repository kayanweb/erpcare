import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Bed,
  HeartPulse,
  Search,
  Plus,
  Filter,
  Users,
  Stethoscope,
  Droplet,
  Clock,
  ChevronRight,
  FileText,
} from "lucide-react";
import { syncSetting, saveSetting, getSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface ICUCase {
  id: string;
  mrn: string;
  name: string;
  bedId: string;
  admissionDate: string;
  diagnosis: string;
  gcsScore: number;
  ventilatorStatus: "None" | "NIV" | "Invasive" | "Weaning";
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
  };
  infusions: string[];
  notes: string;
  status: "Critical" | "Stable" | "Deteriorating" | "Ready for Transfer";
}

export default function ICUDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [patients, setPatients] = useState<ICUCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<ICUCase | null>(null);

  useEffect(() => {
    const unsub = syncSetting("his_icu_cases", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setPatients(data.value);
      } else {
        // Seed if empty
        const seeded: ICUCase[] = [
          {
            id: "ICU-001",
            mrn: "MRN-10594",
            name: "Ahmed Youssef",
            bedId: "Bed 01",
            admissionDate: new Date(Date.now() - 172800000).toISOString(),
            diagnosis: "Severe Sepsis, ARDS",
            gcsScore: 9,
            ventilatorStatus: "Invasive",
            vitals: { hr: 115, bp: "90/55", spo2: 88, temp: 39.2 },
            infusions: ["Norepinephrine", "Propofol"],
            notes: "Unstable hemodynamics, titrating pressors.",
            status: "Critical",
          },
          {
            id: "ICU-002",
            mrn: "MRN-33491",
            name: "Fatma Salem",
            bedId: "Bed 04",
            admissionDate: new Date(Date.now() - 432000000).toISOString(),
            diagnosis: "Post-CABG",
            gcsScore: 14,
            ventilatorStatus: "Weaning",
            vitals: { hr: 85, bp: "120/75", spo2: 96, temp: 37.1 },
            infusions: ["Dobutamine"],
            notes: "Extubated yesterday, stable on 2L NC.",
            status: "Stable",
          },
        ];
        setPatients(seeded);
        saveSetting("his_icu_cases", seeded);
      }
    });
    return () => unsub();
  }, []);

  const updateVitals = async (id: string, newVitals: any) => {
    const next = patients.map((p) =>
      p.id === id ? { ...p, vitals: { ...p.vitals, ...newVitals } } : p,
    );
    setPatients(next);
    await saveSetting("his_icu_cases", next);
    toast.success(isAr ? "تم تحديث العلامات الحيوية" : "Vitals updated");
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bedId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-rose-600" />
            {isAr ? "مركز العناية المركزة (ICU)" : "ICU Command Center"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "مراقبة الحالات الحرجة والمؤشرات الحيوية"
              : "Critical care monitoring & vitals"}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
            />
            <input
              type="text"
              placeholder={
                isAr
                  ? "بحث برقم الملف، الاسم، السرير..."
                  : "Search MRN, Name, Bed..."
              }
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <Plus className="h-4 w-4" />{" "}
            {isAr ? "قبول حالة جديدة" : "Admit Patient"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition shadow-sm ${selectedPatient?.id === patient.id ? "border-rose-500 bg-rose-50/10" : "border-slate-100 hover:border-slate-300"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white ${patient.status === "Critical" ? "bg-rose-600" : patient.status === "Deteriorating" ? "bg-amber-500" : "bg-emerald-500"}`}
                    >
                      {patient.bedId.replace("Bed ", "")}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">
                        {patient.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        {patient.mrn}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-100 ${patient.status === "Critical" ? "text-rose-600" : patient.status === "Deteriorating" ? "text-amber-600" : "text-emerald-600"}`}
                  >
                    {patient.status}
                  </span>
                </div>

                <div className="bg-slate-900 rounded-lg p-3 text-white mb-3 grid grid-cols-4 gap-2 text-center items-center">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      HR
                    </p>
                    <p
                      className={`font-mono font-bold ${patient.vitals.hr > 110 || patient.vitals.hr < 60 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}
                    >
                      {patient.vitals.hr}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      BP
                    </p>
                    <p className="font-mono font-bold text-blue-300">
                      {patient.vitals.bp}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      SPO2
                    </p>
                    <p
                      className={`font-mono font-bold ${patient.vitals.spo2 < 90 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}
                    >
                      {patient.vitals.spo2}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      TEMP
                    </p>
                    <p
                      className={`font-mono font-bold ${patient.vitals.temp > 38 ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {patient.vitals.temp}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded flex items-center gap-1 border border-indigo-100">
                    <Droplet className="h-3 w-3" /> GCS: {patient.gcsScore}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                    VENT: {patient.ventilatorStatus}
                  </span>
                  {patient.infusions.length > 0 && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 truncate max-w-full">
                      {patient.infusions.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Patient Sidebar */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden sticky top-4">
              <div className="bg-slate-800 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-slate-300 font-mono text-sm">
                      {selectedPatient.mrn} • {selectedPatient.bedId}
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Bed className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 text-xs flex justify-between">
                  <span>
                    {isAr ? "التشخيص:" : "Dx:"}{" "}
                    <span className="font-bold text-rose-300">
                      {selectedPatient.diagnosis}
                    </span>
                  </span>
                  <span>
                    {isAr ? "الدخول:" : "Admit:"}{" "}
                    {new Date(
                      selectedPatient.admissionDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                   <button onClick={() => toast.info(isAr ? "تسجيل دخول الرعاية" : "Admit to ICU")} className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded transition">
                     {isAr ? "تسجيل دخول الرعاية" : "Admit to ICU"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "مراقبة حيوية مستمرة (Monitor)" : "Continuous Monitor")} className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-100 font-bold px-2 py-1 rounded transition">
                     {isAr ? "مراقبة حيوية مستمرة" : "Monitor"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "أوامر الرعاية (ICU Orders)" : "ICU Orders")} className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded transition">
                     {isAr ? "أوامر الرعاية (ICU Orders)" : "ICU Orders"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "سوائل وريدية (IV Fluids)" : "IV Fluids & Drips")} className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded transition">
                     {isAr ? "سوائل وريدية" : "IV Fluids"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "جدول التمريض (Nursing Flow)" : "Nursing Flowsheet")} className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded transition">
                     {isAr ? "جدول التمريض" : "Nursing Flow"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "مؤشر الخطورة (Acuity Level)" : "Acuity Level")} className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded transition">
                     {isAr ? "مؤشر الخطورة" : "Acuity Level"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "نقل لجناح التنويم (Transfer out)" : "Transfer to Ward")} className="text-[10px] bg-blue-500/30 hover:bg-blue-500/50 text-blue-100 font-bold px-2 py-1 rounded transition">
                     {isAr ? "نقل للتنويم" : "Transfer Out"}
                   </button>
                   <button onClick={() => toast.info(isAr ? "إعلان وفاة (Mortuary)" : "Declare Expiry")} className="text-[10px] bg-slate-900 hover:bg-black text-slate-300 font-bold px-2 py-1 rounded transition">
                     {isAr ? "وفاة (Mortuary)" : "Mortuary"}
                   </button>
                   <button onClick={() => toast.error(isAr ? "إنعاش (Code Blue)" : "Code Blue!")} className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded transition w-full mt-1">
                     {isAr ? "إنعاش (Code Blue)" : "Code Blue"}
                   </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />{" "}
                    {isAr ? "تحديث العلامات الحيوية" : "Update Vitals"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="HR"
                      className="border border-slate-200 p-2 rounded text-sm text-center font-mono font-bold"
                      defaultValue={selectedPatient.vitals.hr}
                      onChange={(e) => {
                        if (e.target.value)
                          updateVitals(selectedPatient.id, {
                            hr: Number(e.target.value),
                          });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="BP"
                      className="border border-slate-200 p-2 rounded text-sm text-center font-mono font-bold"
                      defaultValue={selectedPatient.vitals.bp}
                      onChange={(e) => {
                        if (e.target.value)
                          updateVitals(selectedPatient.id, {
                            bp: e.target.value,
                          });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="SPO2"
                      className="border border-slate-200 p-2 rounded text-sm text-center font-mono font-bold"
                      defaultValue={selectedPatient.vitals.spo2}
                      onChange={(e) => {
                        if (e.target.value)
                          updateVitals(selectedPatient.id, {
                            spo2: Number(e.target.value),
                          });
                      }}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="TEMP"
                      className="border border-slate-200 p-2 rounded text-sm text-center font-mono font-bold"
                      defaultValue={selectedPatient.vitals.temp}
                      onChange={(e) => {
                        if (e.target.value)
                          updateVitals(selectedPatient.id, {
                            temp: Number(e.target.value),
                          });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />{" "}
                    {isAr ? "ملاحظات سريرية" : "Clinical Notes"}
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedPatient.notes}
                  </p>
                </div>

                <div className="pt-4 flex gap-2">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold text-sm transition">
                    {isAr ? "خريطة السوائل" : "Fluid Chart"}
                  </button>
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm transition">
                    {isAr ? "الطلبات (CPOE)" : "Orders"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Stethoscope className="h-12 w-12 text-slate-200 mb-2" />
              <p className="font-bold text-sm">
                {isAr
                  ? "حدد مريضاً لعرض التفاصيل الكاملة"
                  : "Select a patient to view full details"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
