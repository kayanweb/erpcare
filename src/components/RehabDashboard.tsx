import React, { useState } from "react";
import {
  Activity,
  Calendar,
  UserCheck,
  Dumbbell,
  Stethoscope,
  FileText,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

export default function RehabDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"pt" | "rehab" | "tasks">("pt");

  const [ptSessions] = useState([
    {
      id: "PT-01",
      patient: "Ahmed Youssef",
      type: "Post-Op Ortho",
      therapist: "Dr. Samy",
      time: "10:00 AM",
      status: "In Progress",
    },
    {
      id: "PT-02",
      patient: "Sarah Ali",
      type: "Neuro Rehab",
      therapist: "Dr. Hoda",
      time: "11:30 AM",
      status: "Scheduled",
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
            <Dumbbell className="w-7 h-7 text-indigo-600" />
            {isAr
              ? "العلاج الطبيعي والتأهيل (PT & Rehab)"
              : "Physical Therapy & Rehab"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr
              ? "إدارة الجلسات، التقييم الوظيفي، والتقدم"
              : "Manage sessions, functional assessments, and progress"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setActiveTab("pt")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "pt" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "العلاج الطبيعي (PT)" : "Physical Therapy"}
          </button>
          <button
            onClick={() => setActiveTab("rehab")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "rehab" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "التأهيل الوظيفي" : "Occupational Rehab"}
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
            departmentId="rehab"
            departmentName={isAr ? "قسم التأهيل الطبي" : "Rehabilitation Unit"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  {isAr ? "جدول الجلسات اليومية" : "Daily Session Schedule"}
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
                        {isAr ? "وقت الجلسة" : "Time"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "المريض" : "Patient"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "نوع العلاج" : "Therapy Type"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الأخصائي" : "Therapist"}
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
                    {ptSessions.map((session, idx) => (
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
                        <td className="px-4 py-3 text-slate-600">
                          {session.therapist}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}
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
                                    titleEn: "Opened Assessment Form",
                                    titleAr: "Opened Assessment Form",
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
                {isAr ? "أدوات التقييم والأجهزة" : "Assessment & Devices"}
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr
                      ? "تقييم القدرات الوظيفية"
                      : "Functional Capacity Eval"}
                  </span>
                </button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                  <Stethoscope className="w-5 h-5 text-teal-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "خطة التأهيل الشاملة" : "Comprehensive Rehab Plan"}
                  </span>
                </button>
                <button className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 p-3 rounded-xl flex items-center gap-3 transition border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr
                      ? "طلب أجهزة مساعدة (كرسي/مشاية)"
                      : "Assistive Devices Request"}
                  </span>
                </button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "تقرير تقدم المريض" : "Patient Progress Report"}
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
