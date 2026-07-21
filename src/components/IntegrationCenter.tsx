import React, { useState } from 'react';
import { 
  Share2, Globe, Database, 
  Activity, ShieldCheck, Cpu, Terminal,
  Plus, Save, RefreshCw, Zap, Server,
  Lock, Link2, Code, FileCode, Cloud,
  Clock, Settings
} from 'lucide-react';
import { motion } from 'motion/react';

interface IntegrationEndpoint {
  id: string;
  name: string;
  type: 'HL7' | 'FHIR' | 'API' | 'SQL';
  status: 'online' | 'offline' | 'error';
  lastSync: string;
}

export default function IntegrationCenter({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const [endpoints, setEndpoints] = useState<IntegrationEndpoint[]>([
    { id: 'end-1', name: 'National Health Data Exchange', type: 'FHIR', status: 'online', lastSync: '2 min ago' },
    { id: 'end-2', name: 'Insurance Provider Gateway', type: 'API', status: 'online', lastSync: '15 min ago' },
    { id: 'end-3', name: 'LIS/RIS Laboratory Interface', type: 'HL7', status: 'error', lastSync: '1 hour ago' },
    { id: 'end-4', name: 'External PACs Storage', type: 'SQL', status: 'offline', lastSync: 'Never' }
  ]);

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
       <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <div className="flex items-center gap-5">
                <button 
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
                >
                   <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
                </button>
                <div className="w-16 h-16 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-50 shrink-0">
                   <Cloud className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                     {isAr ? "مركز التكامل والربط (Interoperability)" : "Integration & Interoperability Center"}
                   </h2>
                   <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "إدارة HL7, FHIR, وواجهات API" : "Manage HL7, FHIR, and API Gateways"}</p>
                </div>
             </div>
             <button className="px-6 py-3 bg-indigo-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                <Plus className="w-5 h-5" />
                {isAr ? "نقطة ربط جديدة" : "New Endpoint"}
             </button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Left: Endpoint List */}
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{isAr ? "نقاط الربط النشطة" : "Active Endpoints"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {endpoints.map(ep => (
                     <div key={ep.id} className="p-5 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-200 transition-all group shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             ep.type === 'FHIR' ? 'bg-indigo-50 text-indigo-600' :
                             ep.type === 'HL7' ? 'bg-emerald-50 text-emerald-600' :
                             'bg-slate-50 text-slate-600'
                           }`}>
                              {ep.type}
                           </div>
                           <div className={`w-2.5 h-2.5 rounded-full ${
                             ep.status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' :
                             ep.status === 'error' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                             'bg-slate-300'
                           }`}></div>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">{ep.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" />
                           {isAr ? "آخر مزامنة: " : "Last Sync: "} {ep.lastSync}
                        </p>
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                           <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:underline">
                              <Settings className="w-3.5 h-3.5" />
                              {isAr ? "الإعدادات" : "Config"}
                           </button>
                           <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 hover:text-slate-600">
                              <Terminal className="w-3.5 h-3.5" />
                              {isAr ? "السجلات" : "Logs"}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Right: Health & Security */}
             <div className="space-y-6">
                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10 space-y-6">
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">{isAr ? "حالة الأمان" : "Security Shield"}</h4>
                         <p className="text-xl font-black">{isAr ? "مشفر بالكامل" : "Fully Encrypted"}</p>
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold text-slate-400">SSL/TLS 1.3</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                         </div>
                         <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold text-slate-400">OAuth 2.0 Auth</span>
                            <Lock className="w-4 h-4 text-indigo-400" />
                         </div>
                      </div>
                      <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                         {isAr ? "مراجعة الشهادات" : "Review Certificates"}
                      </button>
                   </div>
                   <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-500 opacity-10 -rotate-12" />
                </div>

                <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "تلميحة برمجية" : "Developer Tools"}</h4>
                   <div className="flex flex-col gap-2">
                      <button className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition text-right rtl:text-right ltr:text-left">
                         <div className="p-2 bg-amber-50 rounded-lg"><Code className="w-4 h-4 text-amber-600" /></div>
                         <div>
                            <p className="text-[11px] font-black text-slate-800">{isAr ? "دليل API الموحد" : "Unified API Specs"}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Swagger / OpenAPI</p>
                         </div>
                      </button>
                      <button className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition text-right rtl:text-right ltr:text-left">
                         <div className="p-2 bg-blue-50 rounded-lg"><FileCode className="w-4 h-4 text-blue-600" /></div>
                         <div>
                            <p className="text-[11px] font-black text-slate-800">{isAr ? "نماذج HL7" : "HL7 Message Templates"}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">XML / JSON v2.x</p>
                         </div>
                      </button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
