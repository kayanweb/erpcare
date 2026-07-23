import React, { useState } from "react";
import { ClipboardList, Activity, Droplet, UserCheck, ShieldAlert, HeartPulse, ListPlus, Pill, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function NursingFlowKardex({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"vitals" | "io" | "assessments" | "mar">("vitals");

  const [gcsScore, setGcsScore] = useState({ eye: 4, verbal: 5, motor: 6 });
  const [bradenScore, setBradenScore] = useState({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 });
  const [newsScore, setNewsScore] = useState({ rr: 1, spo2: 0, oxygen: 0, sysBp: 1, hr: 0, consciousness: 0, temp: 0 });
  const [painScale, setPainScale] = useState(0);

  const totalGCS = gcsScore.eye + gcsScore.verbal + gcsScore.motor;
  const totalBraden = bradenScore.sensory + bradenScore.moisture + bradenScore.activity + bradenScore.mobility + bradenScore.nutrition + bradenScore.friction;
  const totalNEWS = newsScore.rr + newsScore.spo2 + newsScore.oxygen + newsScore.sysBp + newsScore.hr + newsScore.consciousness + newsScore.temp;

  const [marRecords, setMarRecords] = useState([
    { id: 1, med: "Ceftriaxone 1g", dose: "IV Q12H", schedule: "08:00", status: "administered", time: "08:15", nurse: "FZ" },
    { id: 2, med: "Paracetamol 1g", dose: "IV PRN", schedule: "14:00", status: "pending", time: null, nurse: null },
    { id: 3, med: "Enoxaparin 40mg", dose: "SC OD", schedule: "20:00", status: "pending", time: null, nurse: null },
  ]);

  const handleSaveAssessment = () => {
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Assessment saved successfully!", titleAr: "تم حفظ التقييم بنجاح!", type: "form" } }));
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-rose-600" />
            {isAr ? "شيتات التمريض المتخصصة (Intensive Flowsheets)" : "Intensive Nursing Flowsheets"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "العلامات الحيوية المستمرة، السوائل، وتقييمات الوعي ومخاطر السقوط." : "Continuous vitals, intensive I/O, and specialized clinical assessments."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Patient Banner */}
        <div className="p-4 bg-slate-800 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-xl shrink-0">
              S
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Said Kamal</h3>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300 mt-1 font-mono">
                <span>MRN-2026-0341</span>
                <span>|</span>
                <span>ICU-BED-04</span>
                <span>|</span>
                <span className="bg-rose-500/20 text-rose-300 px-2 rounded">High Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("vitals")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "vitals" ? "bg-white text-rose-600 border-b-2 border-rose-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Activity className="w-4 h-4"/> {isAr ? "العلامات الحيوية" : "Continuous Vitals"}
          </button>
          <button 
            onClick={() => setActiveTab("io")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "io" ? "bg-white text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Droplet className="w-4 h-4"/> {isAr ? "شيت السوائل" : "Intake / Output"}
          </button>
          <button 
            onClick={() => setActiveTab("assessments")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "assessments" ? "bg-white text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <UserCheck className="w-4 h-4"/> {isAr ? "التقييمات التخصصية" : "Clinical Assessments"}
          </button>
          <button 
            onClick={() => setActiveTab("mar")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "mar" ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Pill className="w-4 h-4"/> {isAr ? "شيت العلاج (MAR)" : "Medication (MAR)"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          
          {activeTab === "vitals" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700">{isAr ? "تسجيل العلامات الحيوية" : "Record Vitals"}</h4>
                <button className="bg-slate-100 text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition font-bold text-xs flex items-center gap-2">
                  <HeartPulse className="w-4 h-4"/> {isAr ? "قراءة من الأجهزة" : "Fetch from Monitors"}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">BP (mmHg)</label>
                  <input type="text" defaultValue="120/80" className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">HR (bpm)</label>
                  <input type="text" defaultValue="85" className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Temp (°C)</label>
                  <input type="text" defaultValue="37.2" className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">SpO2 (%)</label>
                  <input type="text" defaultValue="98" className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">RR (bpm)</label>
                  <input type="text" defaultValue="18" className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-mono font-bold" />
                </div>
              </div>
              <button className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-rose-700 transition">
                {isAr ? "حفظ السجل" : "Save Vitals"}
              </button>
            </div>
          )}

          {activeTab === "io" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Intake */}
                 <div className="border border-blue-100 rounded-2xl p-4 bg-blue-50/50">
                    <h4 className="font-black text-blue-800 mb-4 flex items-center gap-2">
                      <ListPlus className="w-5 h-5"/> {isAr ? "المدخلات (Intake)" : "Intake"}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-2 min-w-max">
                        <select className="border border-slate-200 rounded-xl p-2 text-sm flex-1 focus:outline-none">
                          <option>IV Fluid (Normal Saline)</option>
                          <option>Oral (Water)</option>
                          <option>Blood Transfusion</option>
                        </select>
                        <input type="number" placeholder="ml" className="w-24 border border-slate-200 rounded-xl p-2 text-sm focus:outline-none" />
                        <button className="bg-blue-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-blue-700">+</button>
                      </div>
                    </div>
                 </div>

                 {/* Output */}
                 <div className="border border-amber-100 rounded-2xl p-4 bg-amber-50/50">
                    <h4 className="font-black text-amber-800 mb-4 flex items-center gap-2">
                      <ListPlus className="w-5 h-5"/> {isAr ? "المخرجات (Output)" : "Output"}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-2 min-w-max">
                        <select className="border border-slate-200 rounded-xl p-2 text-sm flex-1 focus:outline-none">
                          <option>Urine (Catheter)</option>
                          <option>Drain (Surgical)</option>
                          <option>Emesis / Vomitus</option>
                        </select>
                        <input type="number" placeholder="ml" className="w-24 border border-slate-200 rounded-xl p-2 text-sm focus:outline-none" />
                        <button className="bg-amber-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-amber-700">+</button>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-800 text-white p-4 rounded-2xl flex justify-between items-center">
                <span className="font-bold">{isAr ? "ميزان السوائل (24H Balance)" : "24H Fluid Balance"}</span>
                <span className="font-mono text-xl font-black text-emerald-400">+ 150 ml</span>
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
              {/* GCS */}
              <div className="border border-slate-200 rounded-2xl p-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h4 className="font-black text-slate-800">Glasgow Coma Scale (GCS)</h4>
                  <div className="bg-indigo-100 text-indigo-800 font-black text-xl px-3 py-1 rounded-lg">
                    {totalGCS}/15
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Eye Opening (E)</label>
                    <input type="range" min="1" max="4" value={gcsScore.eye} onChange={(e) => setGcsScore({...gcsScore, eye: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                    <div className="text-xs text-center font-medium text-slate-700 mt-1">Score: {gcsScore.eye}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Verbal Response (V)</label>
                    <input type="range" min="1" max="5" value={gcsScore.verbal} onChange={(e) => setGcsScore({...gcsScore, verbal: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                    <div className="text-xs text-center font-medium text-slate-700 mt-1">Score: {gcsScore.verbal}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Motor Response (M)</label>
                    <input type="range" min="1" max="6" value={gcsScore.motor} onChange={(e) => setGcsScore({...gcsScore, motor: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                    <div className="text-xs text-center font-medium text-slate-700 mt-1">Score: {gcsScore.motor}</div>
                  </div>
                </div>
              </div>

              {/* NEWS Score */}
              <div className="border border-slate-200 rounded-2xl p-4">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <h4 className="font-black text-slate-800">NEWS Score (National Early Warning)</h4>
                    <div className={`font-black text-xl px-3 py-1 rounded-lg ${totalNEWS >= 5 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-blue-100 text-blue-800'}`}>
                      {totalNEWS}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">Consciousness (AVPU)</label>
                       <select className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none" onChange={(e) => setNewsScore({...newsScore, consciousness: parseInt(e.target.value)})}>
                          <option value="0">Alert (A)</option>
                          <option value="3">New Confusion (V, P, or U)</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-2 block">SpO2 Level</label>
                       <input type="range" min="0" max="3" step="1" value={newsScore.spo2} onChange={(e) => setNewsScore({...newsScore, spo2: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                       <div className="text-[10px] text-slate-400 text-center">Score: {newsScore.spo2} (0: &gt;96%, 3: &lt;91%)</div>
                    </div>
                 </div>
              </div>

              {/* Pain Scale */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-rose-50/30">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-800">Pain Assessment (0-10)</h4>
                    <span className="text-lg sm:text-2xl font-black text-rose-600">{painScale}</span>
                 </div>
                 <input type="range" min="0" max="10" value={painScale} onChange={(e) => setPainScale(parseInt(e.target.value))} className="w-full accent-rose-600 h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer" />
                 <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>No Pain</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                 </div>
              </div>

              {/* Braden Scale */}
              <div className="border border-slate-200 rounded-2xl p-4 flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h4 className="font-black text-slate-800">Braden Scale (Pressure Ulcer Risk)</h4>
                  <div className={`font-black text-xl px-3 py-1 rounded-lg ${totalBraden <= 9 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {totalBraden}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4 flex-1">
                   {isAr ? "تقييم مخاطر تقرحات الفراش. (أقل من 9 = خطر شديد)." : "Pressure ulcer risk assessment. (Below 9 = Severe risk)."}
                </p>
                
                <button onClick={handleSaveAssessment} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">
                  {isAr ? "اعتماد التقييمات" : "Sign & Submit Assessments"}
                </button>
              </div>

            </div>
          )}
          {activeTab === "mar" && (
            <div className="space-y-6 animate-fade-in">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
                    <thead>
                       <tr className="bg-slate-50 border-y border-slate-100">
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "العلاج" : "Medication"}</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الجرعة" : "Dose"}</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الموعد" : "Schedule"}</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "بواسطة" : "Administered By"}</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {marRecords.map(rec => (
                         <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                               <p className="text-sm font-black text-slate-800">{rec.med}</p>
                            </td>
                            <td className="p-4">
                               <p className="text-xs font-bold text-slate-500">{rec.dose}</p>
                            </td>
                            <td className="p-4 text-sm font-mono font-bold text-slate-600">{rec.schedule}</td>
                            <td className="p-4">
                               {rec.status === 'administered' ? (
                                 <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 w-fit">
                                    <Check className="w-3 h-3" /> Given @ {rec.time}
                                 </span>
                               ) : (
                                 <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest w-fit block">
                                    Pending
                                 </span>
                               )}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-400">{rec.nurse || '-'}</td>
                            <td className="p-4 text-right">
                               {rec.status === 'pending' && (
                                 <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                                    {isAr ? "إعطاء" : "Administer"}
                                 </button>
                               )}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
               
               <div className="flex items-center gap-2 sm:gap-4 flex-wrap  p-4 bg-slate-900 rounded-2xl text-white">
                  <ShieldAlert className="w-6 h-6 text-rose-500" />
                  <div>
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">High Alert Meds</p>
                    <p className="text-xs font-bold">Always verify with 2nd witness for Insulin, Heparin, or Narcotics.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
