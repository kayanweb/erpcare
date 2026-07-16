import React from "react";
import { Network, Database, RefreshCw, CheckCircle, Globe, Link as LinkIcon, Building, Plus } from "lucide-react";

export default function NationalIntegrationHub({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
        >
           <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
        </button>
        <div className="bg-sky-600 p-4 rounded-2xl text-white shadow-lg shadow-sky-200 shrink-0">
          <Network className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            {isAr ? "التكامل الوطني و HL7/FHIR" : "National Integration & FHIR Hub"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "ربط مستشفيات الشبكة، أنظمة التأمين، والمنصات الحكومية" : "Interoperability with Government, Insurance, & External Networks"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          { name: "MOH Health Gateway", type: "Government", status: "Connected", sync: "Real-time", icon: Building, color: "text-blue-600", bg: "bg-blue-50" },
          { name: "National Insurance Hub", type: "Payer", status: "Connected", sync: "Batch (10m)", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
          { name: "External Radiology PACS", type: "Clinical", status: "Connected", sync: "Real-time", icon: Database, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((node, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${node.bg}`}>
                <node.icon className={`w-6 h-6 ${node.color}`} />
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {node.status}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{node.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{node.type} • Sync: {node.sync}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="text-sky-500" />
            {isAr ? "مراقبة تدفق رسائل HL7" : "HL7 Message Flow Monitor"}
          </h2>
          <button className="text-sm font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-4 py-2 rounded-lg transition-colors">
            {isAr ? "إعادة إرسال الرسائل الفاشلة" : "Retry Failed Messages"}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold">
              <tr>
                <th className="p-4 rounded-l-xl">Message Type</th>
                <th className="p-4">Sender Node</th>
                <th className="p-4">Receiver Node</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {[
                { type: "ADT^A01 (Admit)", sender: "HQ-01 (Main)", receiver: "MOH Gateway", status: "Success", time: "10:45:01" },
                { type: "ORM^O01 (Order)", sender: "REG-02", receiver: "External Lab", status: "Success", time: "10:44:52" },
                { type: "ORU^R01 (Result)", sender: "External Lab", receiver: "HQ-01 (Main)", status: "Success", time: "10:42:18" },
                { type: "SIU^S12 (Appt)", sender: "PED-04", receiver: "Patient Portal", status: "Failed", time: "10:40:05" },
                { type: "ADT^A03 (Discharge)", sender: "TR-03", receiver: "Nat. Insurance", status: "Success", time: "10:38:22" },
              ].map((msg, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-800 font-bold">{msg.type}</td>
                  <td className="p-4 text-slate-600">{msg.sender}</td>
                  <td className="p-4 text-slate-600">{msg.receiver}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${msg.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{msg.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
