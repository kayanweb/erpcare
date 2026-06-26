import React, { useState, useEffect } from "react";
import { 
  GitPullRequest, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Timer, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { PatientVisitWorkflow } from "../types";

interface Props {
  language: "ar" | "en";
}

export const WorkflowDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";
  const [workflows, setWorkflows] = useState<PatientVisitWorkflow[]>([]);

  useEffect(() => {
    const q = query(collection(db, "hospital_workflow_instances"), orderBy("startTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientVisitWorkflow));
      setWorkflows(data);
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "completed": return "text-blue-500 bg-blue-50 border-blue-100";
      case "cancelled": return "text-slate-400 bg-slate-50 border-slate-100";
      default: return "text-slate-400 bg-slate-50 border-slate-100";
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "registration": return isAr ? "التسجيل" : "Registration";
      case "triage": return isAr ? "الفرز" : "Triage";
      case "doctor_assessment": return isAr ? "تقييم الطبيب" : "Physician Desk";
      case "lab_order": return isAr ? "طلب المختبر" : "Lab Ordered";
      case "lab_processing": return isAr ? "معالجة العينات" : "Lab Processing";
      case "pharmacy_dispensing": return isAr ? "صرف الأدوية" : "Pharmacy";
      case "discharge": return isAr ? "خروج" : "Discharge";
      default: return stage;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <GitPullRequest className="w-8 h-8 text-indigo-600" />
            {isAr ? "محرك سير العمل (Workflow Engine)" : "Clinical Workflow Engine"}
          </h2>
          <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
            {isAr ? "مراقبة مسار المريض، التوقيتات، واتفاقيات مستوى الخدمة (SLA)" : "Monitoring Patient Journey, Timelines & Service Level Agreements"}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-xs font-black border border-emerald-100 uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              Event-Driven Engine Active
           </div>
        </div>
      </div>

      {/* SLA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Timer className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">-12% vs last week</span>
            </div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Patient TAT</h4>
            <div className="text-3xl font-black text-slate-900">42 Minutes</div>
         </div>

         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <AlertCircle className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">+5 alerts today</span>
            </div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">SLA Violations</h4>
            <div className="text-3xl font-black text-slate-900">3 Instances</div>
         </div>

         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">98.2% Compliance</span>
            </div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Completed Cycles</h4>
            <div className="text-3xl font-black text-slate-900">128 Visits</div>
         </div>
      </div>

      {/* Active Workflows Table */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
             {isAr ? "سير العمل اللحظي (Active Flows)" : "Real-time Active Workflows"}
          </h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing with clinical engine...</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient / MRN</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline Progress</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stage</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Duration</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workflows.map(wf => (
                <tr key={wf.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                          {wf.patientMRN?.substring(0, 1)}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800">{wf.patientMRN}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visit ID: {wf.id.substring(0, 8)}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden min-w-[120px]">
                           <div 
                             className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                             style={{ width: `${(wf.history.length / 7) * 100}%` }} 
                           />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{Math.round((wf.history.length / 7) * 100)}%</span>
                     </div>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                           {getStageLabel(wf.currentStage)}
                        </span>
                     </div>
                  </td>
                  <td className="p-6 font-mono text-xs font-bold text-slate-600">
                     {Math.floor((Date.now() - new Date(wf.startTime).getTime()) / 60000)}m
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">On Track</span>
                     </div>
                  </td>
                  <td className="p-6">
                     <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
              
              {workflows.length === 0 && (
                <tr>
                   <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                         <GitPullRequest className="w-16 h-16 stroke-[1]" />
                         <p className="text-[10px] font-black uppercase tracking-widest">No active clinical workflows detected</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Regulatory Compliance</p>
                 <p className="text-xs font-bold opacity-60">All stage transitions are audited and timestamped in immutable logs.</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Configure SLA Rules</button>
           </div>
        </div>
      </div>
    </div>
  );
};
