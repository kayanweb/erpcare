import React, { useState, useEffect } from "react";
import { 
  Users, 
  Play, 
  SkipForward, 
  Clock, 
  Volume2, 
  Monitor, 
  ArrowRight,
  AlertTriangle,
  History
} from "lucide-react";
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "sonner";
import { PatientVisitWorkflow } from "../types";

interface Props {
  department: string;
  language: "ar" | "en";
}

export const QueueManagement: React.FC<Props> = ({ department, language }) => {
  const isAr = language === "ar";
  const [queue, setQueue] = useState<PatientVisitWorkflow[]>([]);
  const [activePatient, setActivePatient] = useState<PatientVisitWorkflow | null>(null);

  useEffect(() => {
    // In a real app, we'd filter by department too
    const q = query(
      collection(db, "hospital_workflow_instances"),
      where("status", "==", "active"),
      where("currentStage", "==", "triage"), // For example
      orderBy("startTime", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientVisitWorkflow));
      setQueue(data);
    });

    return () => unsubscribe();
  }, [department]);

  const callNext = async () => {
    if (queue.length === 0) {
      toast.info(isAr ? "لا يوجد مرضى في الانتظار" : "No patients in queue");
      return;
    }

    const nextPatient = queue[0];
    setActivePatient(nextPatient);
    
    // Play announcement sound (mock)
    const utterance = new SpeechSynthesisUtterance(
      isAr 
        ? `الرجاء من المريض رقم ${nextPatient.patientMRN} التوجه إلى غرفة التقييم` 
        : `Patient MRN ${nextPatient.patientMRN}, please proceed to the assessment room`
    );
    utterance.lang = isAr ? 'ar-SA' : 'en-US';
    window.speechSynthesis.speak(utterance);

    toast.success(isAr ? `جاري مناداة المريض: ${nextPatient.patientMRN}` : `Calling patient: ${nextPatient.patientMRN}`);
  };

  const skipPatient = () => {
    toast.warning(isAr ? "تم تجاوز المريض" : "Patient skipped");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {isAr ? "إدارة الطابور والانتظار" : "Queue & Wait Management"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {department} • {queue.length} {isAr ? "مرضى في الانتظار" : "Patients Waiting"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={callNext}
            className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            {isAr ? "النداء التالي" : "Call Next"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Active Calling Area */}
        <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30">
           <div className="max-w-md mx-auto h-full flex flex-col justify-center">
              <div className="text-center space-y-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Now Serving</p>
                 
                 {activePatient ? (
                   <div className="space-y-8 animate-in zoom-in duration-500">
                      <div className="bg-white p-12 rounded-[3rem] border-2 border-rose-500 shadow-2xl shadow-rose-100 flex flex-col items-center gap-4">
                         <h1 className="text-6xl font-black text-slate-900">{activePatient.patientMRN}</h1>
                         <div className="h-1 w-24 bg-rose-500 rounded-full" />
                         <p className="text-lg font-bold text-slate-500 uppercase">Assessment Room 04</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4">
                         <button 
                           onClick={() => setActivePatient(null)}
                           className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                         >
                           Complete & Next
                         </button>
                         <button 
                           onClick={skipPatient}
                           className="px-6 py-3 bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all"
                         >
                           No Show / Skip
                         </button>
                      </div>
                   </div>
                 ) : (
                   <div className="py-20 flex flex-col items-center gap-4 text-slate-300">
                      <Monitor className="w-32 h-32 stroke-[0.5]" />
                      <p className="text-sm font-bold uppercase tracking-widest">Screen Idle</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right: Queue List */}
        <div className="w-full lg:w-96 flex flex-col bg-white">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <History className="w-3 h-3" />
                 Next in Queue
              </h4>
              <span className="text-[10px] font-bold text-slate-400">{queue.length}</span>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {queue.map((p, idx) => (
                <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-rose-200 transition-all">
                   <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-slate-300">#{idx + 1}</span>
                      <div>
                        <h5 className="text-sm font-black text-slate-800">{p.patientMRN}</h5>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                           <Clock className="w-3 h-3" />
                           {Math.floor((Date.now() - new Date(p.startTime).getTime()) / 60000)}m wait
                        </div>
                      </div>
                   </div>
                   <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Play className="w-4 h-4" />
                   </button>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="py-20 text-center space-y-3">
                   <Users className="w-8 h-8 text-slate-100 mx-auto" />
                   <p className="text-[10px] font-black text-slate-400 uppercase">Queue is empty</p>
                </div>
              )}
           </div>

           {/* Stats Footer */}
           <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span>Avg. Wait Time</span>
                 <span className="text-slate-800">14 minutes</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-rose-500 h-full w-[65%]" />
              </div>
              <p className="text-[9px] text-slate-400 font-medium italic text-center">Peak hours detected • {department}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
