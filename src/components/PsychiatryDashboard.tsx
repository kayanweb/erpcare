import React, { useState } from "react";
import {
  Brain,
  FileText,
  Calendar,
  Pill,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

export default function PsychiatryDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"sessions" | "tasks">("sessions");

  const [sessions] = useState([
    {
      id: "PSY-01",
      patient: "Ahmed Youssef",
      type: "Cognitive Behavioral",
      time: "10:00 AM",
      status: "Completed",
    },
    {
      id: "PSY-02",
      patient: "Sarah Ali",
      type: "Initial Psych Assessment",
      time: "11:30 AM",
      status: "In Progress",
    },
  ]);

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Brain className="w-7 h-7 text-indigo-600" />
            {isAr ? "الطب النفسي (Psychiatry)" : "Psychiatry & Mental Health"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr
              ? "إدارة التقييمات النفسية والجلسات العلاجية"
              : "Psychiatric assessments and therapy sessions"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "sessions" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "الجلسات العلاجية" : "Therapy Sessions"}
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "tasks" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"} flex items-center gap-1.5`}
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
            departmentId="psychiatry"
            departmentName={isAr ? "قسم الطب النفسي" : "Psychiatry Unit"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  {isAr ? "جدول الجلسات" : "Session Schedule"}
                </h3>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm">
                  {isAr ? "جلسة جديدة" : "New Session"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-left text-sm"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الوقت" : "Time"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "المريض" : "Patient"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "النوع" : "Session Type"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 font-bold text-center">
                        {isAr ? "إجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((session, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-bold text-slate-700">
                          {session.time}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {session.patient}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {session.type}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("openGenericModal", {
                                  detail: {
                                    titleEn: "Opened Psych Assessment Form",
                                    titleAr: "Opened Psych Assessment Form",
                                    type: "form",
                                  },
                                }),
                              )
                            }
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition"
                          >
                            {isAr ? "تقييم أولي" : "Assessment"}
                          </button>
                          <button
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("openGenericModal", {
                                  detail: {
                                    titleEn: "Session noted",
                                    titleAr: "Session noted",
                                    type: "form",
                                  },
                                }),
                              )
                            }
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition"
                          >
                            {isAr ? "تطور الحالة" : "Progress Note"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">
                {isAr ? "أدوات الطب النفسي" : "Psychiatry Tools"}
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                  <UserCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "تقييم نفسي شامل" : "Comprehensive Psych Eval"}
                  </span>
                </button>
                <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl flex items-center gap-3 transition border border-rose-200">
                  <Pill className="w-5 h-5" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "وصف أدوية نفسية" : "Psychiatric Prescriptions"}
                  </span>
                </button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "ملاحظات الجلسة العلاجية" : "Therapy Session Notes"}
                  </span>
                </button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr
                      ? "تقييم خطورة وميول"
                      : "Risk Assessment (Suicide/Harm)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
