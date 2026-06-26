import React from "react";
import { Shield, Key, Users, Lock, LogIn, Fingerprint, Activity } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function IAMDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "إدارة الهوية والصلاحيات" : "Identity & Access Management"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 0 Core - Authentication, Authorization, RBAC, SSO, MFA
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: isAr ? "المستخدمين" : "Users Directory", value: "2,450", icon: Users, color: "text-blue-600" },
          { title: isAr ? "الأدوار (RBAC)" : "Roles (RBAC)", value: "128", icon: Key, color: "text-indigo-600" },
          { title: isAr ? "أجهزة موثوقة" : "Trusted Devices", value: "3,102", icon: Lock, color: "text-emerald-600" },
          { title: isAr ? "تسجيلات الدخول (24س)" : "Active Sessions", value: "845", icon: Activity, color: "text-rose-600" }
        ].map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
             <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.title}</p>
                <p className="text-2xl font-black text-slate-900">{metric.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
         <Fingerprint className="w-20 h-20 text-slate-200 mb-6" />
         <h3 className="text-xl font-black text-slate-800 mb-2">IAM Core Engine</h3>
         <p className="text-sm font-bold text-slate-500 max-w-md uppercase tracking-widest">
            {isAr ? "محرك إدارة الهويات قيد التشغيل. يدعم OpenID Connect, OAuth2, Active Directory, MFA." : "Identity engine active. Supports OpenID Connect, OAuth2, Active Directory, and MFA."}
         </p>
         <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Manage Roles</button>
            <button className="px-6 py-3 bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors">API Keys</button>
            <button className="px-6 py-3 bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors">Audit Logs</button>
         </div>
      </div>
    </div>
  );
}
