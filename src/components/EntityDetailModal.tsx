import React, { useState } from "react";
import { 
  FileText, Activity, Clock, Paperclip, Shield, Edit, X, User, ArrowLeft 
} from "lucide-react";

export function EntityDetailModal({ entity, type, onClose, isAr }: any) {
  const [activeTab, setActiveTab] = useState("summary");

  const tabs = [
    { id: "summary", ar: "الملخص", en: "Summary" },
    { id: "timeline", ar: "التسلسل الزمني", en: "Timeline" },
    { id: "related", ar: "السجلات المرتبطة", en: "Related" },
    { id: "attachments", ar: "المرفقات", en: "Attachments" },
    { id: "audit", ar: "سجل التدقيق", en: "Audit Log" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded-lg transition">
              <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <User className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{entity.name || entity.id || (isAr ? "تفاصيل الكيان" : "Entity Details")}</h2>
              <div className="text-xs text-slate-300 font-mono flex gap-2">
                <span>{type.toUpperCase()}</span>
                <span>•</span>
                <span>ID: {entity.id || "SYS-1029"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">
              <Edit className="w-4 h-4" /> {isAr ? "تعديل" : "Edit"}
            </button>
            <button onClick={onClose} className="text-slate-300 hover:text-white p-2 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? "border-indigo-600 text-indigo-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTab === "summary" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">{isAr ? "المعلومات الأساسية" : "Basic Information"}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(entity).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                        <div className="font-medium text-slate-700 break-words">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    {isAr ? "ملاحظات إكلينيكية / إدارية" : "Clinical / Admin Notes"}
                  </h3>
                  <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-lg text-sm text-slate-700 leading-relaxed">
                    {isAr ? "لا توجد ملاحظات مسجلة لهذا الكيان حتى الآن." : "No notes recorded for this entity yet."}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    {isAr ? "حالة النظام" : "System Status"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-500">{isAr ? "الحالة" : "Status"}</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-bold text-xs">Active</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-500">{isAr ? "تاريخ الإنشاء" : "Created At"}</span>
                      <span className="text-slate-700 font-mono">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="w-0.5 h-full bg-slate-200 my-2"></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1 mb-4">
                  <h4 className="font-bold text-slate-800">{isAr ? "تم الإنشاء" : "Entity Created"}</h4>
                  <p className="text-sm text-slate-500 mt-1">{isAr ? "بواسطة مدير النظام" : "By System Admin"}</p>
                  <span className="text-xs text-slate-400 font-mono mt-2 block">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 font-bold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                    <th className="px-4 py-3">{isAr ? "المستخدم" : "User"}</th>
                    <th className="px-4 py-3">{isAr ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">{new Date().toLocaleString()}</td>
                    <td className="px-4 py-3">Admin</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">CREATE</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
