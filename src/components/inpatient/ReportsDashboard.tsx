import React from "react";
export default function ReportsDashboard({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
      {isAr ? "التقارير ومؤشرات الأداء" : "Reports & KPI"}
    </div>
  );
}
