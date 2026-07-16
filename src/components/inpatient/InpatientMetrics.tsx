import React from "react";
import { Activity, Users, BedDouble, AlertCircle } from "lucide-react";

export default function InpatientMetrics({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  const metrics = [
    { titleAr: "المرضى الحاليين", titleEn: "Current Patients", value: "24", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { titleAr: "الأسرة المتاحة", titleEn: "Available Beds", value: "12", icon: BedDouble, color: "text-green-600", bg: "bg-green-50" },
    { titleAr: "حالات الدخول (اليوم)", titleEn: "Admissions (Today)", value: "5", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { titleAr: "تنبيهات هامة", titleEn: "Critical Alerts", value: "2", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`p-4 rounded-full ${m.bg} ${m.color}`}>
            <m.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{m.value}</div>
            <div className="text-sm text-slate-500">{isAr ? m.titleAr : m.titleEn}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
