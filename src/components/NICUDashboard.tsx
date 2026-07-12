import React, { useState } from "react";
import {
  Baby,
  Activity,
  Scale,
  Syringe,
  HeartPulse,
  ThermometerSnowflake,
  FileText,
  Beaker,
  Plus,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

const hrData = [
  { time: "00:00", value: 145 },
  { time: "01:00", value: 148 },
  { time: "02:00", value: 142 },
  { time: "03:00", value: 150 },
  { time: "04:00", value: 146 },
  { time: "05:00", value: 144 },
];

export default function NICUDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"neonates" | "tasks">("neonates");

  const [neonates] = useState([
    {
      id: "N-101",
      name: "Baby Boy Smith",
      motherMrn: "M-4821",
      weight: "1.2",
      incubator: "Inc-01",
      status: "Critical",
      o2: 92,
      hr: 145,
      temp: 36.5,
      gestation: "28 Weeks",
    },
    {
      id: "N-102",
      name: "Baby Girl Doe",
      motherMrn: "M-3910",
      weight: "2.1",
      incubator: "Inc-04",
      status: "Stable",
      o2: 98,
      hr: 120,
      temp: 37.0,
      gestation: "34 Weeks",
    },
    {
      id: "N-103",
      name: "Baby Boy Ali",
      motherMrn: "M-5021",
      weight: "1.8",
      incubator: "Inc-02",
      status: "Monitoring",
      o2: 95,
      hr: 135,
      temp: 36.8,
      gestation: "32 Weeks",
    },
  ]);

  return (
    <div
      className="p-4 md:p-6 bg-slate-100 min-h-full font-sans animate-fade-in"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Baby className="w-8 h-8 text-pink-500 bg-pink-100 p-1.5 rounded-xl" />
            {isAr
              ? "العناية المركزة لحديثي الولادة (NICU)"
              : "Neonatal ICU (NICU)"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr
              ? "المراقبة الحية للحاضنات والعلامات الحيوية"
              : "Live monitoring of incubators and neonate vitals"}
          </p>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button
            onClick={() => setActiveTab("neonates")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "neonates" ? "bg-pink-100 text-pink-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "حاضنات الوليد" : "Neonate Incubators"}
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "tasks" ? "bg-pink-100 text-pink-700" : "text-slate-500 hover:bg-slate-50"} flex items-center gap-1.5`}
          >
            <ClipboardList className="w-4 h-4" />
            {isAr ? "المهام السريرية" : "Clinical Tasks"}
          </button>
        </div>

        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm">
            <Syringe className="w-4 h-4 text-emerald-500" />
            {isAr ? "جدول التطعيمات" : "Vaccination Schedule"}
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm">
            <Plus className="w-4 h-4" />
            {isAr ? "قبول مولود جديد" : "Admit Newborn"}
          </button>
        </div>
      </div>

      {activeTab === "tasks" ? (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <DepartmentTasks
            language={language}
            departmentId="nicu"
            departmentName={
              isAr ? "قسم العناية المركزة لحديثي الولادة" : "NICU"
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {neonates.map((baby) => (
            <div
              key={baby.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div
                className={`p-4 border-b ${baby.status === "Critical" ? "bg-rose-50 border-rose-100" : baby.status === "Monitoring" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-lg text-slate-800">
                      {baby.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                      <span className="bg-white/60 px-2 py-0.5 rounded-lg border border-slate-200/50">
                        {baby.id}
                      </span>
                      <span>•</span>
                      <span>
                        {isAr ? "الأم:" : "Mother:"} {baby.motherMrn}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        baby.status === "Critical"
                          ? "bg-rose-100 text-rose-700"
                          : baby.status === "Monitoring"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {baby.status === "Critical" && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {baby.status === "Stable" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {isAr && baby.status === "Critical"
                        ? "حرج"
                        : isAr && baby.status === "Stable"
                          ? "مستقر"
                          : isAr
                            ? "مراقبة"
                            : baby.status}
                    </span>
                    <div className="text-[10px] font-bold text-slate-400 mt-1">
                      {baby.incubator}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />{" "}
                    {isAr ? "نبض القلب" : "Heart Rate"}
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    {baby.hr}{" "}
                    <span className="text-xs text-slate-400 font-bold">
                      bpm
                    </span>
                  </div>
                  <div className="h-10 mt-auto opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hrData}>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#f43f5e"
                          fill="#ffe4e6"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />{" "}
                    {isAr ? "الأكسجين" : "SpO2"}
                  </span>
                  <div
                    className={`text-2xl font-black ${baby.o2 < 95 ? "text-rose-600" : "text-slate-800"}`}
                  >
                    {baby.o2}
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-auto">
                    <div
                      className={`h-1.5 rounded-full ${baby.o2 < 95 ? "bg-rose-500" : "bg-blue-500"}`}
                      style={{ width: `${baby.o2}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col col-span-2 flex-row items-center justify-between">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {isAr ? "الوزن" : "Weight"}
                      </span>
                      <div className="flex items-end gap-1">
                        <Scale className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-700">
                          {baby.weight} <span className="text-[10px]">kg</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {isAr ? "الحرارة" : "Temp"}
                      </span>
                      <div className="flex items-end gap-1">
                        <ThermometerSnowflake className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-700">
                          {baby.temp}°C
                        </span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {isAr ? "عمر الحمل" : "Gestation"}
                      </span>
                      <div className="flex items-end gap-1">
                        <span className="font-bold text-slate-700 text-sm">
                          {baby.gestation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
                <button className="py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
                  <Beaker className="w-3.5 h-3.5" />{" "}
                  {isAr ? "تغذية / سوائل" : "Feeding/Fluids"}
                </button>
                <button className="py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />{" "}
                  {isAr ? "التقييم اليومي" : "Daily Assess"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
