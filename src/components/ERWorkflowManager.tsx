import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Zap, Activity, Heart, Thermometer, 
  Droplet, Wind, Brain, Plus, 
  ChevronRight, AlertCircle, Clock,
  User, CheckCircle2, Stethoscope,
  ArrowRight, ShieldAlert, Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ERStage = 'TRIAGE' | 'EXAM' | 'PROCEDURE' | 'OBSERVATION' | 'DISPOSITION';

export default function ERWorkflowManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, updatePatientStatus, addJourneyStep, currentUser } = useHIS();
  const [activeStage, setActiveStage] = useState<ERStage>('TRIAGE');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const erPatients = patients.filter(p => p.status === 'triage' || p.status === 'er');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const stages = [
    { id: 'TRIAGE', en: "Triage & Vitals", ar: "الفرز والعلامات الحيوية", icon: Zap, color: "amber" },
    { id: 'EXAM', en: "Initial Exam", ar: "الفحص الأولي", icon: Stethoscope, color: "blue" },
    { id: 'PROCEDURE', en: "Procedures / Lab", ar: "الإجراءات والمختبر", icon: Droplet, color: "rose" },
    { id: 'OBSERVATION', en: "Observation", ar: "الملاحظة", icon: Activity, color: "emerald" },
    { id: 'DISPOSITION', en: "Disposition", ar: "القرار النهائي", icon: ShieldAlert, color: "indigo" }
  ];

  const handleStatusChange = (status: string, notesEn: string, notesAr: string) => {
    if (!selectedPatientId) return;
    addJourneyStep({
      patientId: selectedPatientId,
      department: 'EMERGENCY',
      status: status,
      actionBy: currentUser?.name || 'ER Doctor',
      notesEn,
      notesAr
    });
  };

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* ER Queue */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-rose-50/30">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4" />
                   {isAr ? "قائمة الطوارئ" : "ER Active Queue"}
                </h3>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded text-[10px] font-black">{erPatients.length}</span>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
             {erPatients.map(p => (
               <button
                 key={p.id}
                 onClick={() => setSelectedPatientId(p.id)}
                 className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right group relative overflow-hidden ${
                   selectedPatientId === p.id 
                    ? "border-rose-200 bg-rose-50 text-rose-700 shadow-sm" 
                    : "border-white hover:bg-slate-50 text-slate-500"
                 }`}
               >
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                   p.triageLevel === 1 ? 'bg-rose-600 text-white animate-pulse' : 
                   p.triageLevel === 2 ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200'
                 }`}>
                    {p.mrn.slice(-4)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{isAr ? p.nameAr : p.nameEn}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                       {isAr ? "وصول: " : "Arrived: "} 10 min ago
                    </p>
                 </div>
                 {p.triageLevel === 1 && (
                    <div className="absolute top-0 right-0 p-1 bg-rose-600 text-white text-[8px] font-black rounded-bl-lg">RED</div>
                 )}
               </button>
             ))}
          </div>
       </div>

       {/* Workflow Canvas */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          {/* Module Header with Close Button */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-100">
                   <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 tracking-tight">{isAr ? "إدارة قسم الطوارئ" : "Emergency Dept Management"}</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "الفرز، الفحص، والتدخل السريع" : "Triage, Examination & Rapid Intervention"}</p>
                </div>
             </div>
             <button 
               onClick={onClose}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Plus className="w-5 h-5 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
          </div>
          {selectedPatient ? (
            <div className="flex-1 flex flex-col">
               {/* Stage Stepper */}
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex gap-2">
                     {stages.map((stage, idx) => (
                       <button
                         key={stage.id}
                         onClick={() => setActiveStage(stage.id as ERStage)}
                         className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                           activeStage === stage.id 
                            ? `bg-${stage.color}-600 text-white shadow-lg shadow-${stage.color}-100` 
                            : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                         }`}
                       >
                          <stage.icon className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? stage.ar : stage.en}</span>
                       </button>
                     ))}
                  </div>
                  <div className="flex items-center gap-3">
                     <Timer className="w-4 h-4 text-slate-400" />
                     <span className="text-xs font-black text-slate-600 font-mono">00:15:22</span>
                  </div>
               </div>

               {/* Stage Content */}
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {activeStage === 'TRIAGE' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                         <div className="grid grid-cols-4 gap-6">
                            {[
                              { label: isAr ? "النبض" : "Pulse", icon: Heart, unit: "bpm", color: "text-rose-500", bg: "bg-rose-50" },
                              { label: isAr ? "ضغط الدم" : "BP", icon: Activity, unit: "mmHg", color: "text-blue-500", bg: "bg-blue-50" },
                              { label: isAr ? "الحرارة" : "Temp", icon: Thermometer, unit: "°C", color: "text-amber-500", bg: "bg-amber-50" },
                              { label: isAr ? "الأكسجين" : "SpO2", icon: Wind, unit: "%", color: "text-emerald-500", bg: "bg-emerald-50" }
                            ].map((v, i) => (
                              <div key={i} className={`${v.bg} p-6 rounded-[24px] border border-white shadow-sm space-y-3`}>
                                 <div className="flex items-center justify-between">
                                    <v.icon className={`w-5 h-5 ${v.color}`} />
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.label}</span>
                                 </div>
                                 <div className="flex items-baseline gap-2">
                                    <input type="text" className="bg-transparent text-2xl font-black w-full outline-none" placeholder="--" />
                                    <span className="text-xs font-bold text-slate-400">{v.unit}</span>
                                 </div>
                              </div>
                            ))}
                         </div>

                         <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
                               <AlertCircle className="w-4 h-4 text-rose-500" />
                               {isAr ? "مستوى الفرز (Manchester Triage)" : "Manchester Triage Level"}
                            </h4>
                            <div className="grid grid-cols-5 gap-4">
                               {[
                                 { lvl: 1, color: "bg-rose-600", labelAr: "فوري", labelEn: "Immediate" },
                                 { lvl: 2, color: "bg-orange-500", labelAr: "مستعجل جداً", labelEn: "Very Urgent" },
                                 { lvl: 3, color: "bg-amber-500", labelAr: "مستعجل", labelEn: "Urgent" },
                                 { lvl: 4, labelAr: "أقل استعجالاً", labelEn: "Standard" },
                                 { lvl: 5, labelAr: "غير عاجل", labelEn: "Non-Urgent" }
                               ].map(l => (
                                 <button key={l.lvl} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${l.lvl === 1 ? 'border-rose-500 bg-rose-50' : 'border-white bg-white hover:border-slate-200'}`}>
                                    <div className={`w-4 h-4 rounded-full ${l.color || 'bg-slate-200'}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? l.labelAr : l.labelEn}</span>
                                 </button>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {activeStage === 'DISPOSITION' && (
                       <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                       >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100 space-y-6">
                                <h4 className="text-sm font-black text-indigo-900">{isAr ? "دخول المستشفى" : "Admission Decision"}</h4>
                                <div className="space-y-3">
                                   <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:border-indigo-400 border border-transparent transition-all group">
                                      <span className="text-xs font-bold">{isAr ? "دخول القسم الداخلي" : "Admit to Ward"}</span>
                                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                   </button>
                                   <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:border-indigo-400 border border-transparent transition-all group">
                                      <span className="text-xs font-bold">{isAr ? "دخول العناية المركزة (ICU)" : "Admit to ICU"}</span>
                                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                   </button>
                                   <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:border-indigo-400 border border-transparent transition-all group">
                                      <span className="text-xs font-bold">{isAr ? "تحويل للعمليات (OT)" : "Transfer to OT"}</span>
                                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                   </button>
                                </div>
                             </div>
                             <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-6">
                                <h4 className="text-sm font-black text-slate-900">{isAr ? "خروج أو تحويل خارجي" : "Discharge & Referral"}</h4>
                                <div className="space-y-3">
                                   <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:border-rose-400 border border-transparent transition-all group">
                                      <span className="text-xs font-bold">{isAr ? "خروج نهائي" : "Discharge Patient"}</span>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                   </button>
                                   <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:border-rose-400 border border-transparent transition-all group">
                                      <span className="text-xs font-bold">{isAr ? "تحويل لمستشفى آخر" : "Transfer Outside"}</span>
                                      <ArrowRight className="w-4 h-4 text-slate-400" />
                                   </button>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Footer Actions */}
               <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
                  <button className="h-12 px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition">
                     {isAr ? "حفظ كمسودة" : "Save Draft"}
                  </button>
                  <button 
                    onClick={() => handleStatusChange('TRIAGE_COMPLETE', 'Triage completed in ER', 'اكتملت عملية الفرز في الطوارئ')}
                    className="h-12 px-10 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition shadow-xl shadow-rose-100 flex items-center gap-2"
                  >
                     <CheckCircle2 className="w-4 h-4" />
                     {isAr ? "إتمام وتمرير" : "Complete & Proceed"}
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
               <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                  <Zap className="w-12 h-12 text-rose-300" />
               </div>
               <h3 className="text-lg font-black text-slate-800">{isAr ? "إدارة مسار الطوارئ الذكي" : "Smart ER Workflow Management"}</h3>
               <p className="text-xs text-slate-400 font-bold max-w-sm mt-2 leading-relaxed">
                  {isAr 
                    ? "الرجاء اختيار مريض من قائمة الفرز للبدء في توثيق العلامات الحيوية والتشخيص الأولي."
                    : "Please select a patient from the triage queue to begin documenting vitals and initial diagnosis."
                  }
               </p>
            </div>
          )}
       </div>
    </div>
  );
}
