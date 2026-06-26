import React from "react";
import { Cpu, Workflow, MessageSquare, Bell, Calendar, Search, FileText, Database } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function PlatformEnginesDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  const engines = [
    { title: "Workflow Engine", desc: "No-code business process automation", icon: Workflow, color: "text-indigo-600" },
    { title: "Rules Engine", desc: "Clinical & financial decision trees", icon: Cpu, color: "text-rose-600" },
    { title: "Notification Engine", desc: "Omnichannel alerts (SMS, Email, Push)", icon: Bell, color: "text-amber-600" },
    { title: "Scheduling Engine", desc: "Complex resource & time slot management", icon: Calendar, color: "text-blue-600" },
    { title: "Search Engine", desc: "Elastic full-text patient & record search", icon: Search, color: "text-emerald-600" },
    { title: "Document Engine", desc: "Dynamic PDF & smart text generation", icon: FileText, color: "text-purple-600" },
    { title: "Cache & Event Bus", desc: "Redis / Kafka for high throughput", icon: Database, color: "text-slate-600" },
    { title: "AI Engine Copilot", desc: "LLM integration for clinical tasks", icon: MessageSquare, color: "text-teal-600" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "محركات المنصة المركزية" : "Core Platform Engines"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 15 - The Enterprise Backbone
          </p>
        </div>
      </div>

      <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-xl shadow-indigo-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
         <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Healthcare OS Architecture</h3>
            <p className="text-indigo-100 font-bold text-sm max-w-xl leading-relaxed">
               These shared engines power all 70+ modules in the system. When a new module (like IVF or Dental) is added, it reuses these engines instead of rebuilding core logic.
            </p>
         </div>
         <div className="relative z-10 shrink-0">
            <button className="px-6 py-3 bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
               System Architecture Diagram
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {engines.map((engine, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${engine.color} mb-4 group-hover:scale-110 transition-transform`}>
                 <engine.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-800 mb-1">{engine.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 {engine.desc}
              </p>
           </div>
         ))}
      </div>
    </div>
  );
}
