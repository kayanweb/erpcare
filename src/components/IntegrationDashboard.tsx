import React from "react";
import { Link, Zap, Database, Globe, Webhook, Fingerprint } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function IntegrationDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Link className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "مركز التكامل والترابط" : "Integration & API Hub"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 14 - HL7, FHIR, DICOM, National APIs, IoT
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Interfaces List */}
         <div className="lg:col-span-2 space-y-4">
            <IntegrationCard 
              name="HL7 v2 Message Broker" 
              status="Online" 
              desc="Routing ADT, ORM, ORU messages to LIS/RIS and external systems." 
              icon={Database} 
              type="Core" 
              color="text-emerald-500" 
              bg="bg-emerald-50"
            />
            <IntegrationCard 
              name="FHIR R4/R5 Gateway" 
              status="Online" 
              desc="RESTful APIs for modern web/mobile apps and patient portals." 
              icon={Globe} 
              type="API" 
              color="text-blue-500" 
              bg="bg-blue-50"
            />
            <IntegrationCard 
              name="DICOM PACS Interface" 
              status="Syncing" 
              desc="Image transfer and worklist sync with modalities." 
              icon={Fingerprint} 
              type="Imaging" 
              color="text-indigo-500" 
              bg="bg-indigo-50"
            />
            <IntegrationCard 
              name="National Health Insurance API" 
              status="Idle" 
              desc="Real-time eligibility and claims submission to regulatory bodies." 
              icon={Webhook} 
              type="Gov" 
              color="text-slate-500" 
              bg="bg-slate-50"
            />
         </div>

         {/* Stats Panel */}
         <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
               <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                  <Zap className="w-4 h-4" /> Message Throughput
               </h3>
               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Messages Today</p>
                     <p className="text-4xl font-black">1.2M</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Error Rate</p>
                     <p className="text-3xl font-black text-emerald-400">0.04%</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Active Webhooks</p>
                     <p className="text-2xl font-black text-blue-400">42</p>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                  Open API Documentation
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function IntegrationCard({ name, status, desc, icon: Icon, type, color, bg }: any) {
   const isOnline = status === "Online" || status === "Syncing";
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-300 transition-colors">
         <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} shrink-0`}>
            <Icon className="w-6 h-6" />
         </div>
         <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
               <h3 className="text-sm font-black text-slate-800">{name}</h3>
               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {status}
               </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{type}</p>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
         </div>
      </div>
   );
}
