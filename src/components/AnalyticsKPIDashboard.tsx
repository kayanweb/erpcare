import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Activity, Banknote, X } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";

export default function AnalyticsKPIDashboard({
  language,
  onClose,
}: {
  language: "ar" | "en";
  onClose?: () => void;
}) {
  const isAr = language === "ar";

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-0 ltr:right-0 rtl:left-0 p-1.5 hover:bg-slate-200 rounded-lg transition text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-indigo-600" />
            {isAr
              ? "لوحة القيادة والمؤشرات (KPI)"
              : "Analytics & KPI Dashboard"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "الأداء المالي، معدل إشغال الأسرة، والمقاييس السريرية"
              : "Executive summary of bed occupancy, revenue, and clinical metrics."}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500">
              {isAr ? "إجمالي الإيرادات" : "Daily Revenue"}
            </span>
            <Banknote className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">
            124,500 <span className="text-lg text-slate-400">SR</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500">
              {isAr ? "إشغال الأسرة" : "Bed Occupancy"}
            </span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">82%</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500">
              {isAr ? "زيارات الطوارئ" : "ER Visits"}
            </span>
            <Users className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">142</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500">
              {isAr ? "متوسط الإقامة" : "Avg Length of Stay"}
            </span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">
            3.2{" "}
            <span className="text-lg text-slate-400">
              {isAr ? "أيام" : "Days"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
