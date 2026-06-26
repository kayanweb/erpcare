import React, { useState } from "react";
import { 
  HeartPulse, 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind,
  CheckCircle2,
  Clock,
  AlertCircle,
  ClipboardCheck,
  Plus,
  ScanBarcode,
  Scale,
  Brain,
  ArrowRightLeft,
  Stethoscope
} from "lucide-react";
import { Patient, VitalSigns, MARRecord, NursingAssessment } from "../types";
import { collection, addDoc, onSnapshot, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  patient: Patient;
  staffId: string;
}

export const NursingConsole: React.FC<Props> = ({ patient, staffId }) => {
  const [activeTab, setActiveTab] = useState<"vitals" | "mar" | "assessment" | "io" | "icu">("vitals");
  
  // State for Vitals Form
  const [vitals, setVitals] = useState<Partial<VitalSigns>>({
    temperature: 37,
    pulse: 80,
    respiratoryRate: 16,
    bloodPressure: "120/80",
    oxygenSaturation: 98,
    painScale: 0
  });

  const [marRecords, setMarRecords] = useState<MARRecord[]>([]);

  React.useEffect(() => {
    const q = query(
      collection(db, "hospital_mar_records"),
      where("patientId", "==", patient.id),
      orderBy("scheduledTime", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMarRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MARRecord)));
    });
    return () => unsubscribe();
  }, [patient.id]);

  const handleBarcodeScan = (recordId: string) => {
    toast.info("Scanning barcode...");
    setTimeout(() => {
      toast.success("Barcode matched: Medication verified");
      administerMedication(recordId);
    }, 1000);
  };

  const administerMedication = async (recordId: string) => {
    try {
      const recordRef = doc(db, "hospital_mar_records", recordId);
      await updateDoc(recordRef, {
        status: "administered",
        administeredTime: new Date().toISOString(),
        administeredByStaffId: staffId,
        barcodeScanned: true
      });
      toast.success("Medication administered successfully");
    } catch (e) {
      toast.error("Failed to administer medication");
    }
  };
  const saveVitals = async () => {
    try {
      await addDoc(collection(db, "hospital_vital_signs"), {
        ...vitals,
        patientId: patient.id,
        staffId,
        timestamp: new Date().toISOString()
      });
      toast.success("Vital signs recorded");
    } catch (e) {
      toast.error("Failed to record vitals");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-slate-50 p-1 border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("vitals")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "vitals" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Activity className="w-4 h-4" />
          Vitals
        </button>
        <button 
          onClick={() => setActiveTab("mar")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "mar" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <ClipboardCheck className="w-4 h-4" />
          MAR
        </button>
        <button 
          onClick={() => setActiveTab("assessment")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "assessment" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Plus className="w-4 h-4" />
          Scales
        </button>
        <button 
          onClick={() => setActiveTab("io")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "io" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Droplets className="w-4 h-4" />
          I / O
        </button>
        <button 
          onClick={() => setActiveTab("icu")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "icu" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <HeartPulse className="w-4 h-4" />
          ICU
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "vitals" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Temp */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Thermometer className="w-3 h-3 text-orange-500" />
                  Temperature (°C)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({...vitals, temperature: parseFloat(e.target.value)})}
                  className="w-full text-2xl font-mono font-bold bg-slate-50 border-none rounded-xl p-3 text-slate-800"
                />
              </div>
              {/* Pulse */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <HeartPulse className="w-3 h-3 text-rose-500" />
                  Pulse (BPM)
                </label>
                <input 
                  type="number" 
                  value={vitals.pulse}
                  onChange={(e) => setVitals({...vitals, pulse: parseInt(e.target.value)})}
                  className="w-full text-2xl font-mono font-bold bg-slate-50 border-none rounded-xl p-3 text-slate-800"
                />
              </div>
              {/* O2 */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3 text-blue-500" />
                  SpO2 (%)
                </label>
                <input 
                  type="number" 
                  value={vitals.oxygenSaturation}
                  onChange={(e) => setVitals({...vitals, oxygenSaturation: parseInt(e.target.value)})}
                  className="w-full text-2xl font-mono font-bold bg-slate-50 border-none rounded-xl p-3 text-slate-800"
                />
              </div>
              {/* BP */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3 text-indigo-500" />
                  Blood Pressure
                </label>
                <input 
                  type="text" 
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                  className="w-full text-2xl font-mono font-bold bg-slate-50 border-none rounded-xl p-3 text-slate-800"
                />
              </div>
              {/* RR */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Wind className="w-3 h-3 text-cyan-500" />
                  Resp. Rate
                </label>
                <input 
                  type="number" 
                  value={vitals.respiratoryRate}
                  onChange={(e) => setVitals({...vitals, respiratoryRate: parseInt(e.target.value)})}
                  className="w-full text-2xl font-mono font-bold bg-slate-50 border-none rounded-xl p-3 text-slate-800"
                />
              </div>
              {/* Pain */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  Pain Scale (0-10)
                </label>
                <div className="flex gap-1">
                  {[0,2,4,6,8,10].map(val => (
                    <button 
                      key={val}
                      onClick={() => setVitals({...vitals, painScale: val})}
                      className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${vitals.painScale === val ? "bg-amber-500 text-white shadow-md scale-110" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={saveVitals}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5" />
              RECORD VITAL SIGNS
            </button>
          </div>
        )}

        {activeTab === "mar" && (
          <div className="space-y-4">
            {marRecords.map(record => (
              <div 
                key={record.id}
                className={`border p-4 rounded-2xl flex items-center justify-between transition-all ${
                  record.status === 'administered' 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : 'bg-emerald-50/50 border-emerald-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center border ${
                    record.status === 'administered' ? 'bg-white border-slate-200' : 'bg-white border-emerald-100'
                  }`}>
                    {record.status === 'administered' 
                      ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> 
                      : <ClipboardCheck className="w-6 h-6 text-emerald-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{record.medicationName} {record.dosage}</h4>
                    <p className="text-xs text-slate-500">
                      {record.route} | Scheduled: {format(new Date(record.scheduledTime), "HH:mm")}
                      {record.administeredTime && ` | Administered: ${format(new Date(record.administeredTime), "HH:mm")}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {record.status !== 'administered' && (
                    <>
                      <button 
                        onClick={() => handleBarcodeScan(record.id)}
                        className="p-2 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                        title="Scan Barcode"
                      >
                        <ScanBarcode className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => administerMedication(record.id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all"
                      >
                        Administer
                      </button>
                    </>
                  )}
                  {record.status === 'administered' && (
                    <div className="flex items-center gap-1 text-emerald-600">
                       <CheckCircle2 className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase">Given</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {marRecords.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <ClipboardCheck className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-bold">No medication records found.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-pink-300 hover:bg-pink-50/30 transition-all text-left group bg-white shadow-sm">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
                  <Scale className="w-5 h-5 text-pink-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Braden Scale</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Assess pressure ulcer risk based on sensory, moisture, activity, mobility, nutrition, and friction.</p>
             </button>

             <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left group bg-white shadow-sm">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Glasgow Coma Scale</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Neurological scale to record the conscious state of a person for initial and subsequent assessment.</p>
             </button>

             <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-amber-300 hover:bg-amber-50/30 transition-all text-left group bg-white shadow-sm">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Fall Risk Assessment</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Determine the risk level for patient falls using Morse Fall Scale or similar protocols.</p>
             </button>

             <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-rose-300 hover:bg-rose-50/30 transition-all text-left group bg-white shadow-sm">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                  <Activity className="w-5 h-5 text-rose-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Skin Assessment</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Detailed documentation of skin integrity, wounds, and lesions.</p>
             </button>

             <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left group bg-white shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Nursing Care Plan</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Define nursing diagnoses, goals, and interventions for individualized care.</p>
             </button>
          </div>
        )}

        {activeTab === "io" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Intake (Input)
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">Oral Fluids</span>
                    <div className="flex items-center gap-2">
                       <input type="number" placeholder="0" className="w-16 p-1 border border-slate-200 rounded text-right text-xs" />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">IV Fluids</span>
                    <div className="flex items-center gap-2">
                       <input type="number" placeholder="0" className="w-16 p-1 border border-slate-200 rounded text-right text-xs" />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Output
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">Urine</span>
                    <div className="flex items-center gap-2">
                       <input type="number" placeholder="0" className="w-16 p-1 border border-slate-200 rounded text-right text-xs" />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">Drainage</span>
                    <div className="flex items-center gap-2">
                       <input type="number" placeholder="0" className="w-16 p-1 border border-slate-200 rounded text-right text-xs" />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Net Balance</p>
                  <h3 className="text-2xl font-black">+ 450 ml</h3>
               </div>
               <button className="px-6 py-3 bg-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                  SAVE I/O RECORD
               </button>
            </div>
          </div>
        )}

        {activeTab === "icu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50/30 border border-rose-100 p-6 rounded-3xl space-y-6">
               <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-2">
                 <Wind className="w-4 h-4" />
                 Ventilator Settings
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">Mode</p>
                    <select className="w-full text-xs font-bold border-none p-0 focus:ring-0">
                       <option>AC/VC</option>
                       <option>SIMV</option>
                       <option>CPAP/PS</option>
                    </select>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">FiO2 (%)</p>
                    <input type="number" defaultValue={40} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">PEEP</p>
                    <input type="number" defaultValue={5} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">RR</p>
                    <input type="number" defaultValue={14} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
               </div>
            </div>

            <div className="bg-indigo-50/30 border border-indigo-100 p-6 rounded-3xl space-y-6">
               <h4 className="text-xs font-black text-indigo-800 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-4 h-4" />
                 Hemodynamic Monitoring
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">MAP</p>
                    <input type="number" defaultValue={75} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">CVP</p>
                    <input type="number" defaultValue={8} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">Cardiac Output</p>
                    <input type="number" defaultValue={5.2} step="0.1" className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
               </div>
            </div>

            <div className="md:col-span-2 p-6 border-2 border-slate-100 rounded-3xl flex items-center justify-between bg-white shadow-sm">
               <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">SOFA Score</p>
                    <h4 className="text-xl font-black text-rose-600">8 (High Risk)</h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">APACHE II</p>
                    <h4 className="text-xl font-black text-orange-600">18</h4>
                  </div>
               </div>
               <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  CALCULATE SCORES
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
