import React, { useState } from "react";
import { 
  Bone, Search, Filter, Calendar, Camera, 
  FileText, CheckCircle2, AlertTriangle, Monitor,
  Upload, Scan
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function RadiologyDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"orders" | "pacs">("orders");

  const [orders] = useState([
    { id: "RAD-882", patient: "Ahmed Youssef", type: "MRI Brain", priority: "Urgent", status: "Pending", time: "10:30 AM" },
    { id: "RAD-883", patient: "Sarah Ali", type: "X-Ray Chest", priority: "Routine", status: "In Progress", time: "11:00 AM" },
    { id: "RAD-884", patient: "Omar Hassan", type: "CT Abdomen", priority: "STAT", status: "Pending", time: "11:15 AM" },
  ]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Bone className="w-7 h-7 text-indigo-600" />
            {isAr ? "قسم الأشعة والتصوير الطبي (RIS/PACS)" : "Radiology & Imaging (RIS/PACS)"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة طلبات الأشعة، الجدولة، وكتابة التقارير" : "Radiology orders, scheduling, and reporting"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "orders" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "طلبات الأشعة (RIS)" : "Radiology Orders"}
          </button>
          <button 
            onClick={() => setActiveTab("pacs")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "pacs" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "عارض الصور (PACS)" : "PACS Viewer"}
          </button>
        </div>
      </div>

      {activeTab === "orders" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div className="flex gap-2">
                 <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition">
                   <Filter className="w-4 h-4" /> {isAr ? "تصنيف (MRI, CT, X-Ray)" : "Filter Modality"}
                 </button>
               </div>
               <div className="relative w-full sm:w-auto">
                  <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isAr ? "right-3" : "left-3"}`} />
                  <input type="text" placeholder={isAr ? "بحث في الطلبات..." : "Search orders..."} className={`w-full sm:w-64 border border-slate-200 rounded-lg py-2 focus:border-indigo-500 outline-none text-sm ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"}`} />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">{isAr ? "رقم الطلب" : "Order ID"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "المريض" : "Patient"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "نوع الفحص" : "Exam Type"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "الأولوية" : "Priority"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono text-slate-600">{order.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{order.patient}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{order.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : order.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                         <span className="text-xs font-bold text-indigo-600">{order.status}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                         <button onClick={() => toast.success("Order Accepted")} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition">
                           Accept
                         </button>
                         <button onClick={() => toast.info("Opened Scheduler")} className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1.5 rounded text-[10px] font-bold transition">
                           Schedule
                         </button>
                         <button onClick={() => toast.info("Exam Started")} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition">
                           Perform
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">{isAr ? "أدوات أخصائي الأشعة" : "Radiologist Tools"}</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab("pacs")} className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl flex items-center gap-3 transition">
                    <Monitor className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold text-left flex-1">{isAr ? "قراءة الصور (PACS)" : "Read Images (PACS)"}</span>
                  </button>
                  <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-bold text-left flex-1">{isAr ? "كتابة واعتماد التقرير" : "Write & Sign Report"}</span>
                  </button>
                  <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                    <Upload className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-bold text-left flex-1">{isAr ? "رفع صور خارجية" : "Upload External CD"}</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === "pacs" && (
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner overflow-hidden flex flex-col relative animate-fade-in min-h-[500px]">
           <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between text-slate-300">
              <div className="flex items-center gap-4">
                 <Monitor className="w-5 h-5 text-indigo-500" />
                 <span className="font-mono text-sm font-bold">PACS DICOM Viewer [MOCK]</span>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition">Layout</button>
                 <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition">Tools</button>
              </div>
           </div>
           <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                 <Scan className="w-16 h-16 text-slate-700 mx-auto mb-4 animate-pulse" />
                 <h3 className="text-xl font-black text-slate-500 mb-2">DICOM Viewer Placeholder</h3>
                 <p className="text-slate-600 text-sm max-w-sm mx-auto">
                   In a real deployment, a zero-footprint HTML5 DICOM viewer (like OHIF or Cornerstone.js) would be mounted here.
                 </p>
                 <button onClick={() => setActiveTab("orders")} className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg">
                   Return to Orders
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
