import React, { useState } from "react";
import { Link, Zap, Database, Globe, Webhook, Fingerprint, Activity, Server, ArrowRightLeft, ShieldCheck, Cpu } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function IntegrationDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"overview" | "hl7" | "apis" | "devices">("overview");
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Link className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "مركز التكامل والترابط" : "Integration & API Hub"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              {isAr ? "الترابط الوطني، أجهزة المعامل، والأشعة" : "HL7, FHIR, DICOM, National APIs, IoT"}
            </p>
          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 overflow-x-auto max-w-full">
          {[
            { id: "overview", label: isAr ? "نظرة عامة" : "Overview" },
            { id: "hl7", label: "HL7 / FHIR" },
            { id: "apis", label: isAr ? "الواجهات (APIs)" : "Web APIs" },
            { id: "devices", label: isAr ? "الأجهزة الطبية" : "Medical IoT" },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <ArrowRightLeft className="w-5 h-5" />
                   </div>
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">{isAr ? "إجمالي الرسائل" : "Total Messages"}</h3>
                </div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">1.2M</p>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">{isAr ? "نسبة نجاح التوصيل" : "Delivery Success"}</h3>
                </div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">99.96%</p>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Server className="w-5 h-5" />
                   </div>
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">{isAr ? "نقاط النهاية النشطة" : "Active Endpoints"}</h3>
                </div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">42</p>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Activity className="w-5 h-5" />
                   </div>
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">{isAr ? "زمن الاستجابة" : "Avg Latency"}</h3>
                </div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">24ms</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Core Integration Engines</h3>
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
                  type="Gov API" 
                  color="text-slate-500" 
                  bg="bg-slate-50"
                />
             </div>

             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 mb-8">
                   <h3 className="text-2xl font-black tracking-tight mb-2">Message Engine</h3>
                   <p className="text-slate-400 font-medium text-sm leading-relaxed">
                     The central engine is currently processing incoming HL7 ADT feeds from admission points and dispatching updates to connected clinical modules.
                   </p>
                </div>
                
                <div className="relative z-10 p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl mb-8 font-mono text-[10px] text-emerald-400 overflow-hidden">
                   <p>MSH|^~\&|HIS|HOSPITAL|LIS|LAB|202607021234||ORM^O01|MSG001|P|2.4</p>
                   <p>PID|1||123456^^^MRN||DOE^JOHN||19800101|M</p>
                   <p>ORC|NW|ORD123|||||^^^202607021230</p>
                   <p>OBR|1|ORD123||CBC^Complete Blood Count|||202607021230</p>
                   <div className="w-full h-1 bg-slate-700 mt-4 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-emerald-500 animate-[pulse_1s_ease-in-out_infinite]" />
                   </div>
                </div>

                <button className="relative z-10 w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-xl">
                   Open Trace Logs
                </button>
             </div>
          </div>
        </>
      )}

      {activeTab !== "overview" && (
         <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-sm text-center p-8">
           <Cpu className="w-20 h-20 text-indigo-200 mb-6" />
           <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              {activeTab === 'hl7' ? 'HL7 & FHIR Engine' : activeTab === 'apis' ? 'Web API Gateway' : 'Medical Devices IoT'}
           </h3>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
             Dedicated interface for configuring endpoints, routing rules, mapping dictionaries, and monitoring real-time data flows.
           </p>
           <button className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all">
             Configure Module
           </button>
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ name, status, desc, icon: Icon, type, color, bg }: any) {
   const isOnline = status === "Online" || status === "Syncing";
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-300 transition-colors cursor-pointer">
         <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
         </div>
         <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
               <h3 className="text-sm font-black text-slate-800">{name}</h3>
               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {status}
               </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{type}</p>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
         </div>
      </div>
   );
}
