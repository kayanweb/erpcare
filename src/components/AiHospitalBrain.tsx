import React, { useState } from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  Activity, 
  Stethoscope, 
  AlertCircle,
  FileText,
  LineChart,
  Zap,
  Mic,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { Patient } from "../types";

interface Props {
  patient?: Patient;
  language: "ar" | "en";
}

export const AiHospitalBrain: React.FC<Props> = ({ patient, language }) => {
  const isAr = language === "ar";
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const runDiagnosisSuggestion = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAiOutput(isAr 
        ? "بناءً على العلامات الحيوية والتاريخ المرضي، الاحتمالات هي: 1. التهاب رئوي حاد (85%)، 2. التهاب القصبات الهوائية (12%)، 3. عدوى فيروسية (3%). يُنصح بطلب صورة أشعة للصدر."
        : "Based on vitals and history, suspected conditions: 1. Acute Pneumonia (85%), 2. Bronchitis (12%), 3. Viral Infection (3%). Recommendation: Order Chest X-Ray.");
      setIsProcessing(false);
    }, 2000);
  };

  const runInteractionCheck = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAiOutput(isAr
        ? "تنبيه: تم اكتشاف تفاعل دوائي محتمل بين 'Warfarin' و 'Aspirin'. خطر متزايد للنزيف. يُنصح بمراجعة الجرعة."
        : "Alert: Potential drug-drug interaction between 'Warfarin' and 'Aspirin'. Increased bleeding risk. Recommendation: Review dosage.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full font-sans text-white relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 blur-[100px] -ml-32 -mb-32" />

      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/50">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase tracking-widest">
              AI Hospital Brain
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </h3>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.2em]">Clinical Intelligence Core</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Neural Link Active</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           {/* Left: Tools */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Neural Analysis Tools</h4>
              
              <button 
                onClick={runDiagnosisSuggestion}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 transition-all flex items-center gap-4 group"
              >
                 <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                   <Stethoscope className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-xs font-black uppercase tracking-widest text-indigo-100">{isAr ? "اقتراح تشخيص" : "Diagnosis Suggestion"}</p>
                   <p className="text-[9px] text-white/40">{isAr ? "تحليل الأعراض والعلامات الحيوية" : "Analyze symptoms & vitals"}</p>
                 </div>
              </button>

              <button 
                onClick={runInteractionCheck}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-rose-500/50 transition-all flex items-center gap-4 group"
              >
                 <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                   <Zap className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-xs font-black uppercase tracking-widest text-rose-100">{isAr ? "كشف التفاعلات" : "Interaction Detection"}</p>
                   <p className="text-[9px] text-white/40">{isAr ? "فحص تعارضات الأدوية والأغذية" : "Check drug & food conflicts"}</p>
                 </div>
              </button>

              <button className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all flex items-center gap-4 group">
                 <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                   <FileText className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-xs font-black uppercase tracking-widest text-emerald-100">{isAr ? "تلخيص الزيارة" : "Visit Summarization"}</p>
                   <p className="text-[9px] text-white/40">{isAr ? "توليد ملخص تنفيذي للحالة" : "Generate executive summary"}</p>
                 </div>
              </button>

              <button className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-amber-500/50 transition-all flex items-center gap-4 group">
                 <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                   <Mic className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-xs font-black uppercase tracking-widest text-amber-100">{isAr ? "تحويل الصوت" : "Voice to Note"}</p>
                   <p className="text-[9px] text-white/40">{isAr ? "تحويل الإملاء الطبي إلى نص" : "Convert medical dictation"}</p>
                 </div>
              </button>
           </div>

           {/* Right: Insights Output */}
           <div className="flex flex-col">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Real-time Intelligence Output</h4>
              <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-6 relative overflow-hidden flex flex-col">
                 {isProcessing ? (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Processing Neural Pathways...</p>
                   </div>
                 ) : aiOutput ? (
                   <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
                      <div className="flex-1 font-mono text-sm text-indigo-100/90 leading-relaxed">
                         {aiOutput}
                      </div>
                      <div className="mt-6 flex gap-2">
                         <button className="flex-1 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Apply Recommendation</button>
                         <button onClick={() => setAiOutput(null)} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss</button>
                      </div>
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <Activity className="w-12 h-12 text-white/5" />
                      <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Select an analysis tool to begin</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Predictive Section */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-rose-900/50 p-6 rounded-3xl border border-white/10">
           <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <LineChart className="w-4 h-4" />
                 Predictive Risk Scoring
              </h4>
              <div className="text-[10px] font-black bg-white/10 px-2 py-1 rounded">Confidence: 94%</div>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-tight">Readmission Risk</p>
                 <div className="text-2xl font-black text-emerald-400">Low (12%)</div>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-tight">Sepsis Score</p>
                 <div className="text-2xl font-black text-indigo-400">0.2</div>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-tight">SLA Violation Risk</p>
                 <div className="text-2xl font-black text-amber-400">Med (35%)</div>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-tight">Fraud Detection</p>
                 <div className="text-2xl font-black text-white/20">Inactive</div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <MessageSquare className="w-4 h-4 text-indigo-400" />
               <span className="text-[10px] font-black uppercase tracking-widest">Chat with Assistant</span>
            </div>
            <div className="flex items-center gap-2 text-white/20">
               <AlertCircle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Ethical AI Guardrails Active</span>
            </div>
         </div>
         <button className="text-[10px] font-black bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 px-4 py-2 rounded-xl uppercase tracking-widest transition-all">
            Audit AI Decisions
         </button>
      </div>
    </div>
  );
};
