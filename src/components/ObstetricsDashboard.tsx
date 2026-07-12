import React, { useState } from "react";
import {
  Baby,
  Activity,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Stethoscope,
  HeartPulse,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

const fhrData = [
  { time: "10:00", fhr: 140 },
  { time: "10:05", fhr: 142 },
  { time: "10:10", fhr: 138 },
  { time: "10:15", fhr: 145 },
  { time: "10:20", fhr: 155 },
  { time: "10:25", fhr: 135 },
  { time: "10:30", fhr: 142 },
  { time: "10:35", fhr: 140 },
  { time: "10:40", fhr: 148 },
];

export default function ObstetricsDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"labor" | "prenatal" | "tasks">(
    "labor",
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Baby className="w-8 h-8 text-fuchsia-500 bg-fuchsia-100 p-1.5 rounded-xl" />
            {isAr
              ? "النساء والولادة (Obstetrics & Gynecology)"
              : "Obstetrics & Gynecology (OB/GYN)"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr
              ? "إدارة غرف الولادة، تخطيط المخاض (Partogram)، ومتابعة الحمل"
              : "Labor rooms management, Partogram, and prenatal care"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button
            onClick={() => setActiveTab("labor")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "labor" ? "bg-fuchsia-100 text-fuchsia-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "غرف الولادة (Labor & Delivery)" : "Labor & Delivery (L&D)"}
          </button>
          <button
            onClick={() => setActiveTab("prenatal")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "prenatal" ? "bg-fuchsia-100 text-fuchsia-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "متابعة الحمل (Prenatal)" : "Prenatal Care"}
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "tasks" ? "bg-fuchsia-100 text-fuchsia-700" : "text-slate-500 hover:bg-slate-50"} flex items-center gap-1.5`}
          >
            <ClipboardList className="w-4 h-4" />
            {isAr ? "المهام السريرية" : "Clinical Tasks"}
          </button>
        </div>
      </div>

      {activeTab === "tasks" ? (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <DepartmentTasks
            language={language}
            departmentId="obs"
            departmentName={
              isAr ? "قسم النساء والولادة" : "Obstetrics & Gynecology Unit"
            }
          />
        </div>
      ) : activeTab === "labor" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Partogram / Fetal Monitor Card */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-fuchsia-50 text-fuchsia-600 rounded-full flex items-center justify-center border-2 border-fuchsia-100">
                    <span className="font-black text-xl">L2</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">
                      Fatima Ali (32y)
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        G3P2
                      </span>
                      <span>•</span>
                      <span>39w 2d</span>
                      <span>•</span>
                      <span className="text-fuchsia-600 font-bold">
                        Active Labor
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-800">
                    142{" "}
                    <span className="text-sm text-slate-500 font-bold">
                      bpm
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1 mt-1">
                    <HeartPulse className="w-3 h-3" /> FHR Normal
                  </div>
                </div>
              </div>

              {/* CTG Monitor Mockup */}
              <div className="bg-slate-900 rounded-2xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute top-2 left-4 text-xs font-mono font-bold text-emerald-400">
                  Fetal Heart Rate (FHR)
                </div>
                <div className="h-32 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fhrData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[100, 180]} hide />
                      <Area
                        type="monotone"
                        dataKey="fhr"
                        stroke="#10b981"
                        fill="#047857"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute top-2 right-4 text-xs font-mono font-bold text-amber-400">
                  Contractions (TOCO)
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 mb-1">
                    {isAr ? "توسع العنق" : "Cervical Dilation"}
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    6{" "}
                    <span className="text-sm font-bold text-slate-500">cm</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 mb-1">
                    {isAr ? "انمحاء العنق" : "Effacement"}
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    80{" "}
                    <span className="text-sm font-bold text-slate-500">%</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 mb-1">
                    {isAr ? "محطة النزول" : "Station"}
                  </span>
                  <div className="text-2xl font-black text-slate-800">+1</div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-xl transition shadow-sm">
                  {isAr ? "تسجيل ولادة (Delivery Record)" : "Log Delivery"}
                </button>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition shadow-sm">
                  {isAr ? "تحديث التقييم" : "Update Vitals"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-4">
                {isAr ? "حالة غرف الولادة" : "L&D Ward Status"}
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-fuchsia-200 bg-fuchsia-50 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">Room L1</h4>
                    <p className="text-xs text-slate-500">
                      Mona Khalid (Active)
                    </p>
                  </div>
                  <span className="bg-fuchsia-200 text-fuchsia-800 text-[10px] font-bold px-2 py-1 rounded">
                    Occupied
                  </span>
                </div>
                <div className="p-3 border border-fuchsia-200 bg-fuchsia-50 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">Room L2</h4>
                    <p className="text-xs text-slate-500">
                      Fatima Ali (Pushing)
                    </p>
                  </div>
                  <span className="bg-fuchsia-200 text-fuchsia-800 text-[10px] font-bold px-2 py-1 rounded">
                    Occupied
                  </span>
                </div>
                <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl flex justify-between items-center opacity-70">
                  <div>
                    <h4 className="font-bold text-slate-800">Room L3</h4>
                    <p className="text-xs text-slate-500">Cleaned & Ready</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-fuchsia-500" />
            <h3 className="text-xl font-black text-slate-800">
              {isAr
                ? "قائمة متابعة الحمل (Prenatal Care)"
                : "Prenatal Care Schedule"}
            </h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{isAr ? "المريضة" : "Patient"}</th>
                <th className="px-4 py-3">{isAr ? "العمر الإنجابي" : "G/P"}</th>
                <th className="px-4 py-3">
                  {isAr ? "عمر الحمل" : "Gestational Age"}
                </th>
                <th className="px-4 py-3">{isAr ? "الموعد المتوقع" : "EDD"}</th>
                <th className="px-4 py-3 text-center">
                  {isAr ? "زيارة قادمة" : "Next Visit"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-4 py-4 font-bold text-slate-800">
                  Laila Ahmed
                </td>
                <td className="px-4 py-4 text-slate-600 font-medium">G1P0</td>
                <td className="px-4 py-4 font-bold text-fuchsia-600">
                  12 Weeks
                </td>
                <td className="px-4 py-4 text-slate-600">2026-12-15</td>
                <td className="px-4 py-4 text-center">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    View File
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
