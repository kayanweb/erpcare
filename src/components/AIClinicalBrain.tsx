import React, { useState } from 'react';
import { 
  BrainCircuit, Activity, Stethoscope, AlertTriangle, 
  CheckCircle2, FileText, Zap, Sparkles
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export const AIClinicalBrain: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 max-w-5xl mx-auto space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-800 text-slate-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <BrainCircuit className="w-10 h-10 text-indigo-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-indigo-400">AI CLINICAL BRAIN</h1>
            <p className="text-slate-400 text-sm font-mono mt-1">
              {isAr ? "مساعد الطبيب الذكي المعتمد على البروتوكول" : "Protocol-driven intelligent physician assistant"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Doctor Input Simulation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-slate-500" />
            {isAr ? "إدخال الطبيب (الشكوى الرئيسية)" : "Physician Input (Chief Complaint)"}
          </h3>
          
          <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 font-mono text-sm text-slate-700 relative">
            <p>55yo male presenting with sudden onset <strong className="bg-yellow-200 px-1 rounded">Chest Pain</strong>, radiating to left arm. Sweating. History of hypertension.</p>
            <div className="absolute bottom-4 right-4 animate-pulse text-indigo-500">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            {isAr ? "توصيات البروتوكول (Acute Coronary Syndrome)" : "Protocol Recommendations (ACS)"}
          </h3>
          
          <div className="space-y-3">
            {[
              { id: 1, action: "Order ECG (STAT)", type: "Diagnostic", priority: "High" },
              { id: 2, action: "Order Troponin T, High Sensitive", type: "Lab", priority: "High" },
              { id: 3, action: "Administer Aspirin 300mg PO", type: "Medication", priority: "High" },
              { id: 4, action: "Consult Cardiology", type: "Consult", priority: "Medium" }
            ].map(rec => (
              <div key={rec.id} className="bg-white p-3 rounded-lg border border-indigo-100 flex items-start gap-3 shadow-sm">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300" />
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{rec.action}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{rec.type}</span>
                    <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{rec.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-colors flex justify-center items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {isAr ? "اعتماد وتنفيذ الطلبات" : "Approve & Execute Orders"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIClinicalBrain;
