import React, { useState } from "react";
import { 
  Users, UserCheck, Search, Printer, Thermometer, 
  PhoneCall, Map, MessageSquare, Plus, FileText, 
  Activity, Clock, CalendarDays, Shield
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  departments?: string[];
}

export default function GateReceptionDashboard({ language, departments = [] }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"gate" | "reception">("gate");

  const [visitors, setVisitors] = useState([
    { id: "V-101", name: "Ahmed Youssef", destination: "ICU", timeIn: "10:30 AM", status: "Active" },
    { id: "V-102", name: "Sarah Ali", destination: "Ward 3", timeIn: "11:15 AM", status: "Active" },
  ]);

  const [patients, setPatients] = useState([
    { id: "P-4402", name: "Omar Hassan", clinic: departments[0] || "Cardiology", apptTime: "12:00 PM", status: "Arrived" },
    { id: "P-4415", name: "Laila Mahmoud", clinic: departments[1] || "Pediatrics", apptTime: "12:30 PM", status: "Waiting" },
  ]);

  const handlePrintPass = (name: string) => {
    toast.success(isAr ? `تم طباعة تصريح لـ ${name}` : `Printed pass for ${name}`);
  };

  const handleThermalScan = () => {
    toast.info(isAr ? "يتم فحص الحرارة..." : "Scanning temperature...");
    setTimeout(() => {
      toast.success(isAr ? "الحرارة طبيعية: 36.8°C" : "Temperature Normal: 36.8°C");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-600" />
            {isAr ? "بوابة الدخول والاستقبال" : "Gate & Main Reception"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة دخول الزوار، تسجيل المرضى وتوجيههم" : "Manage visitor access, patient check-in and routing"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("gate")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "gate" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "بوابة الدخول (Gate)" : "Gate Management"}
          </button>
          <button 
            onClick={() => setActiveTab("reception")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "reception" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "الاستقبال (Reception)" : "Main Reception"}
          </button>
        </div>
      </div>

      {activeTab === "gate" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-500" />
                  {isAr ? "الزوار الحاليين" : "Active Visitors"}
                </h3>
                <button className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition">
                  <Plus className="w-4 h-4" /> {isAr ? "تسجيل زائر" : "New Visitor"}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-bold">{isAr ? "رقم الزائر" : "ID"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الاسم" : "Name"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الوجهة" : "Destination"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "وقت الدخول" : "Time In"}</th>
                      <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitors.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono text-slate-600">{v.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{v.name}</td>
                        <td className="px-4 py-3 text-slate-600">{v.destination}</td>
                        <td className="px-4 py-3 text-slate-600">{v.timeIn}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handlePrintPass(v.name)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition" title={isAr ? "طباعة تصريح" : "Print Pass"}>
                            <Printer className="w-4 h-4" />
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
               <h3 className="font-bold text-slate-800 mb-4">{isAr ? "أدوات البوابة السريعة" : "Quick Gate Tools"}</h3>
               <div className="grid grid-cols-2 gap-3">
                 <button onClick={handleThermalScan} className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition text-center">
                   <Thermometer className="w-6 h-6" />
                   <span className="text-xs font-bold">{isAr ? "كشف الحرارة" : "Thermal Scan"}</span>
                 </button>
                 <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition text-center">
                   <UserCheck className="w-6 h-6" />
                   <span className="text-xs font-bold">{isAr ? "تأكيد موعد" : "Verify Appt"}</span>
                 </button>
                 <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition text-center col-span-2">
                   <Printer className="w-6 h-6" />
                   <span className="text-xs font-bold">{isAr ? "طباعة تصريح دخول سريع" : "Quick Pass Print"}</span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reception" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-500" />
                  {isAr ? "وصول المرضى (Check-in)" : "Patient Check-in"}
                </h3>
                <div className="relative">
                  <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isAr ? "right-3" : "left-3"}`} />
                  <input type="text" placeholder={isAr ? "بحث عن مريض..." : "Search patient..."} className={`pl-9 pr-9 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:border-indigo-500 outline-none ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"}`} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-bold">{isAr ? "رقم المريض" : "MRN"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الاسم" : "Patient Name"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "العيادة" : "Clinic"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الموعد" : "Time"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono text-slate-600">{p.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600">{p.clinic}</td>
                        <td className="px-4 py-3 text-slate-600">{p.apptTime}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status === "Arrived" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center">
                           <button onClick={() => toast.success("Checked In")} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-xs font-bold transition">
                             Check-in
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
               <h3 className="font-bold text-slate-800 mb-4">{isAr ? "خدمة العملاء والتوجيه" : "CS & Routing"}</h3>
               <div className="space-y-2">
                 <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                   <PhoneCall className="w-5 h-5 text-teal-600" />
                   <span className="text-sm font-bold text-left flex-1">{isAr ? "مركز الاتصال" : "Call Center"}</span>
                 </button>
                 <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                   <Map className="w-5 h-5 text-indigo-600" />
                   <span className="text-sm font-bold text-left flex-1">{isAr ? "خريطة وتوجيه المريض" : "Patient Routing Map"}</span>
                 </button>
                 <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                   <MessageSquare className="w-5 h-5 text-amber-600" />
                   <span className="text-sm font-bold text-left flex-1">{isAr ? "الشكاوى والاقتراحات" : "Complaints"}</span>
                 </button>
                 <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                   <FileText className="w-5 h-5 text-purple-600" />
                   <span className="text-sm font-bold text-left flex-1">{isAr ? "جدول العيادات" : "Clinics Schedule"}</span>
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
