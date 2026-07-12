import React, { useState } from "react";
import { Activity, Droplet, Search, ShieldCheck, ThermometerSnowflake, Users } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function BloodBankDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"inventory" | "requests">("inventory");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Droplet className="w-8 h-8 text-rose-600 bg-rose-100 p-1.5 rounded-xl" />
            {isAr ? "بنك الدم" : "Blood Bank"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة مخزون الدم، المتبرعين، وصرف الوحدات" : "Manage blood inventory, donors, and dispatching"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "inventory" ? "bg-rose-100 text-rose-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "المخزون المتوفر" : "Inventory"}
          </button>
          <button 
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "requests" ? "bg-rose-100 text-rose-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "طلبات الدم والتوافق" : "Crossmatch Requests"}
          </button>
        </div>
      </div>

      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Inventory Board */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['O+', 'O-', 'A+', 'A-'].map(bg => (
                <div key={bg} className={`bg-white p-5 rounded-2xl shadow-sm border ${bg === 'O-' ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} text-center relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 ${bg === 'O-' ? 'bg-rose-100' : 'bg-rose-50'} rounded-bl-full -mr-2 -mt-2`}></div>
                  <h3 className={`text-3xl font-black ${bg === 'O-' ? 'text-rose-700' : 'text-rose-600'} mb-1`}>{bg}</h3>
                  <div className="text-slate-500 text-xs font-bold mb-3">{isAr ? "فصيلة الدم" : "Blood Group"}</div>
                  <div className={`text-2xl font-bold ${bg === 'O-' ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                    {bg === 'O-' ? '2' : '14'} <span className={`text-sm font-normal ${bg === 'O-' ? 'text-rose-500' : 'text-slate-400'}`}>{isAr ? "وحدة" : "Units"}</span>
                  </div>
                  {bg === 'O-' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-black py-1 uppercase tracking-wider">
                      {isAr ? "مخزون حرج!" : "CRITICAL LOW!"}
                    </div>
                  )}
                </div>
              ))}
              {['B+', 'B-', 'AB+', 'AB-'].map(bg => (
                <div key={bg} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-2 -mt-2"></div>
                  <h3 className="text-3xl font-black text-slate-700 mb-1">{bg}</h3>
                  <div className="text-slate-500 text-xs font-bold mb-3">{isAr ? "فصيلة الدم" : "Blood Group"}</div>
                  <div className="text-2xl font-bold text-slate-800">5 <span className="text-sm font-normal text-slate-400">{isAr ? "وحدة" : "Units"}</span></div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-lg text-slate-800 mb-4">{isAr ? "وحدات الدم قريبة الانتهاء" : "Expiring Soon"}</h3>
              <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "رقم الوحدة" : "Unit ID"}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الفصيلة" : "Group"}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "النوع" : "Component"}</th>
                    <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "تاريخ الانتهاء" : "Expiry Date"}</th>
                    <th className={`px-4 py-3 text-center`}>{isAr ? "الحالة" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-rose-600">BU-98201</td>
                    <td className="px-4 py-3 font-bold">O-</td>
                    <td className="px-4 py-3 text-slate-600">PRBC</td>
                    <td className="px-4 py-3 text-slate-800">2026-07-02</td>
                    <td className="px-4 py-3 text-center"><span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">Expiring 24h</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-rose-600">BU-98214</td>
                    <td className="px-4 py-3 font-bold">A+</td>
                    <td className="px-4 py-3 text-slate-600">Platelets</td>
                    <td className="px-4 py-3 text-slate-800">2026-07-03</td>
                    <td className="px-4 py-3 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Expiring 48h</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-rose-600 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
               <h3 className="font-bold text-lg mb-4">{isAr ? "ملخص البنك" : "Bank Summary"}</h3>
               <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-black">124</div>
                    <div className="text-rose-100 text-sm font-medium">{isAr ? "إجمالي الوحدات المتاحة" : "Total Available Units"}</div>
                  </div>
                  <div className="w-full h-px bg-rose-500/50"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xl font-black">12</div>
                      <div className="text-rose-100 text-xs font-medium">{isAr ? "متبرع اليوم" : "Today's Donors"}</div>
                    </div>
                    <div>
                      <div className="text-xl font-black">8</div>
                      <div className="text-rose-100 text-xs font-medium">{isAr ? "وحدات منصرفة" : "Units Dispatched"}</div>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <ThermometerSnowflake className="w-4 h-4 text-sky-500" />
                {isAr ? "حالة ثلاجات الحفظ" : "Storage Status"}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">Fridge A (PRBC)</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs">4.2°C</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">Freezer B (FFP)</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs">-22.5°C</span>
                </div>
                <div className="flex justify-between items-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-sm font-bold text-rose-700">Incubator C (Plt)</span>
                  <span className="text-rose-600 font-bold bg-white px-2 py-1 rounded text-xs">24.1°C - Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">{isAr ? "طلبات الدم المستعجلة والعادية" : "Blood Requisition"}</h3>
            <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm">
              {isAr ? "تسجيل طلب جديد" : "New Requisition"}
            </button>
          </div>
          <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "القسم" : "Department"}</th>
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "المريض" : "Patient"}</th>
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الفصيلة" : "Group"}</th>
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "المطلوب" : "Required"}</th>
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الأولوية" : "Priority"}</th>
                <th className={`px-4 py-3 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "حالة التوافق" : "Crossmatch Status"}</th>
                <th className={`px-4 py-3 text-center`}>{isAr ? "إجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-800">ER - Trauma</td>
                <td className="px-4 py-3 text-slate-700">Unknown Male</td>
                <td className="px-4 py-3 font-bold text-rose-600">O- (MTP)</td>
                <td className="px-4 py-3 text-slate-600">4 PRBC, 4 FFP</td>
                <td className="px-4 py-3"><span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Emergency</span></td>
                <td className="px-4 py-3"><span className="text-amber-600 font-bold flex items-center gap-1"><Activity className="w-4 h-4"/> Uncrossmatched</span></td>
                <td className="px-4 py-3 text-center">
                  <button className="text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    {isAr ? "صرف فوري" : "Issue Now"}
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-800">OR - Room 3</td>
                <td className="px-4 py-3 text-slate-700">Sarah Youssef</td>
                <td className="px-4 py-3 font-bold text-slate-800">A+</td>
                <td className="px-4 py-3 text-slate-600">2 PRBC</td>
                <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Urgent</span></td>
                <td className="px-4 py-3"><span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Compatible</span></td>
                <td className="px-4 py-3 text-center">
                  <button className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    {isAr ? "صرف واعتماد" : "Issue & Sign"}
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-800">Ward - Internal Med</td>
                <td className="px-4 py-3 text-slate-700">Ali Mahmoud</td>
                <td className="px-4 py-3 font-bold text-slate-800">B+</td>
                <td className="px-4 py-3 text-slate-600">1 PRBC</td>
                <td className="px-4 py-3"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Routine</span></td>
                <td className="px-4 py-3"><span className="text-slate-500 font-bold">Pending Sample</span></td>
                <td className="px-4 py-3 text-center">
                  <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    {isAr ? "تفاصيل" : "Details"}
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
