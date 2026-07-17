import React from "react";
export default function AdmissionForm({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
      {isAr ? "نموذج الدخول والتنويم" : "Admission Form"}
    </div>
  );
}
