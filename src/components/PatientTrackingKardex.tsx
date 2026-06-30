import React from "react";
import { Users, Activity } from "lucide-react";

export default function PatientTrackingKardex({ language, forceDepartmentId }: { language: string, forceDepartmentId?: string }) {
  const isAr = language === "ar";
  return (
    <div className="p-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-slate-800">{isAr ? "كارديكس ومتابعة المرضى" : "Patient Tracking (Kardex)"}</h3>
        <p className="text-slate-500 mt-2">{isAr ? "سجل متابعة خطة الرعاية للمرضى" : "Patient care plan tracking system"}</p>
      </div>
    </div>
  );
}
