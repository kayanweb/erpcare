import React, { useState } from "react";
import { Truck, MapPin, Search, Plus, Filter, AlertCircle, Clock, Map } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function AmbulanceDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"fleet" | "dispatch" | "maintenance">("fleet");

  const fleet = [
    { id: "AMB-001", plate: "ABC-1234", type: "Advanced Life Support (ALS)", status: "Available", location: "Hospital Bay 1" },
    { id: "AMB-002", plate: "XYZ-9876", type: "Basic Life Support (BLS)", status: "Dispatched", location: "En route to Main St." },
    { id: "AMB-003", plate: "MNO-5566", type: "Patient Transport", status: "Maintenance", location: "Garage" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Truck className="w-8 h-8 text-rose-600 bg-rose-100 p-1.5 rounded-xl" />
            {isAr ? "الإسعاف" : "Ambulance"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة أسطول الإسعاف وحركة السيارات" : "Manage ambulance fleet and dispatch"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "fleet", labelAr: "الأسطول", labelEn: "Fleet Status", icon: Truck },
          { id: "dispatch", labelAr: "طلبات التحرك", labelEn: "Dispatch Board", icon: MapPin },
          { id: "maintenance", labelAr: "الصيانة", labelEn: "Maintenance", icon: AlertCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-rose-100 text-rose-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-rose-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => toast.success(isAr ? "تم الفتح" : "Action opened")}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إجراء جديد" : "New Action"}
            </button>
          </div>
        </div>

        {activeTab === "fleet" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "رقم المركبة" : "Vehicle ID"}</th>
                  <th className="px-4 py-3">{isAr ? "اللوحة" : "Plate"}</th>
                  <th className="px-4 py-3">{isAr ? "النوع" : "Type"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-4 py-3">{isAr ? "الموقع" : "Location"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fleet.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{f.id}</td>
                    <td className="px-4 py-3 text-slate-600">{f.plate}</td>
                    <td className="px-4 py-3 text-slate-600">{f.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        f.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                        f.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{f.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "dispatch" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md mb-2 inline-block">EMERGENCY</span>
                     <h4 className="font-bold text-slate-800 text-lg">Cardiac Arrest at Main St.</h4>
                     <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> 123 Main Street, Downtown</p>
                   </div>
                   <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> 2m ago</span>
                 </div>
                 <div className="flex gap-2">
                   <button className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Dispatch AMB-001</button>
                   <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold">View Details</button>
                 </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl border border-slate-200 h-64 flex flex-col items-center justify-center text-slate-400">
               <Map className="w-12 h-12 mb-2" />
               <span>{isAr ? "خريطة التتبع المباشر" : "Live Tracking Map"}</span>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "سجل الصيانة" : "Maintenance Logs"}</h3>
            <p className="text-slate-500">{isAr ? "لا توجد مركبات في الصيانة حالياً" : "No vehicles currently in maintenance"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
