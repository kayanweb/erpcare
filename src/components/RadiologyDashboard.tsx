import React, { useState, useEffect } from "react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { 
  Bone, Search, Filter, Calendar, Camera, 
  FileText, CheckCircle2, AlertTriangle, Monitor,
  Upload, Scan, Activity, Maximize2, Layers
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function RadiologyDashboard({ language }: Props) {
  const isAr = language === "ar";
  const { cpoeOrders, setCpoeOrders } = useHIS();
  const [activeTab, setActiveTab] = useState<"orders" | "pacs">("pacs");
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState(() => [
    { id: "RAD-882", mrn: "MRN-2026-0301", patient: "Ahmed Youssef", type: "MRI Brain", priority: "Urgent", status: "Pending", time: "10:30 AM", doctor: "Dr. Laila", isCpoe: false },
    { id: "RAD-883", mrn: "MRN-2026-0302", patient: "Sarah Ali", type: "X-Ray Chest", priority: "Routine", status: "In Progress", time: "11:00 AM", doctor: "Dr. Ahmed", isCpoe: false },
    { id: "RAD-884", mrn: "MRN-2026-0303", patient: "Omar Hassan", type: "CT Abdomen", priority: "STAT", status: "Pending", time: "11:15 AM", doctor: "Dr. Khaled", isCpoe: false },
  ]);
  const [activeStudy, setActiveStudy] = useState<any>(null);

  useEffect(() => {
    if (cpoeOrders) {
      const cpoeRadOrders = cpoeOrders
        .filter((o: any) => o.orderType === "Radiology")
        .map((o: any) => ({
          id: o.id,
          mrn: o.mrn || "Unknown",
          patient: o.patientName,
          type: o.orderName || "Radiology Exam",
          priority: o.priority || "Routine",
          status: o.status === "Pending" ? "Pending" : "Completed",
          time: "-",
          doctor: o.doctorId || "System",
          isCpoe: true
        }));
      
      setOrders(prev => {
        const nonCpoe = prev.filter((p: any) => !p.isCpoe);
        return [...cpoeRadOrders, ...nonCpoe];
      });
    }
  }, [cpoeOrders]);

  const handleSignReport = () => {
    if (activeStudy?.isCpoe && setCpoeOrders) {
      setCpoeOrders((prev: any) => 
        prev.map((o: any) => o.id === activeStudy.id ? { ...o, status: "Completed" } : o)
      );
    }
    setOrders(prev => prev.map(o => o.id === activeStudy?.id ? { ...o, status: "Completed" } : o));
    toast.success(isAr ? "تم اعتماد التقرير" : "Report Signed");
  };

  return (
    <div className="flex flex-col h-full bg-black font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Bar for PACS / RIS */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-900/50 rounded-xl flex items-center justify-center border border-cyan-700">
               <Bone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white tracking-wide">
                 {isAr ? "الأشعة والتصوير الطبي (RIS/PACS)" : "Radiology & Imaging (RIS/PACS)"}
               </h2>
               <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> System Online</span>
                  <span>|</span>
                  <span>Connected to 3 Modalities</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button 
              onClick={() => setActiveTab("pacs")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "pacs" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              {isAr ? "نظام عرض الصور (PACS)" : "PACS Viewer"}
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "orders" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              {isAr ? "طلبات الأشعة (Orders)" : "Worklist / Orders"}
            </button>
         </div>
      </div>

      {activeTab === "pacs" && (
         <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Worklist */}
            <div className={`w-full md:w-72 bg-slate-900 border-b md:border-b-0 rtl:md:border-l rtl:md:border-r-0 md:border-r border-slate-800 flex flex-col shrink-0 ${activeStudy ? "hidden md:flex" : "flex h-full"}`}>
               <div className="p-4 border-b border-slate-800">
                  <div className="relative">
                     <Search className="w-4 h-4 text-slate-500 absolute top-2.5 left-3" />
                     <input 
                        type="text"
                        placeholder={isAr ? "بحث برقم المريض..." : "Search MRN / Name..."}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500"
                     />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-2">
                 {orders.map((study, idx) => (
                   <div 
                     key={study.id} 
                     onClick={() => setActiveStudy(study)}
                     className={`p-3 rounded-xl border cursor-pointer transition ${activeStudy?.id === study.id ? "bg-cyan-900/30 border-cyan-800" : "bg-slate-950 border-slate-800 hover:border-slate-600"}`}>
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-white"><GlobalEntityLink entityId={study.mrn} entityName={study.patient} entityType="patient" isAr={isAr}>{study.patient} ({study.mrn})</GlobalEntityLink></span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{study.priority}</span>
                     </div>
                     <div className="text-xs text-cyan-400 font-bold mb-1">{study.type}</div>
                     <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>{study.id}</span>
                        <span className={study.status === "Completed" ? "text-emerald-500" : "text-amber-500"}>{study.status}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Main Viewer */}
            <div className="flex-1 flex flex-col relative bg-black">
               <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 backdrop-blur-md" title="Window Level">
                     <Monitor className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 backdrop-blur-md" title="Pan / Zoom">
                     <Maximize2 className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center border border-slate-700 backdrop-blur-md" title="Series Layout">
                     <Layers className="w-5 h-5" />
                  </button>
               </div>
               
               {/* Mock Image Display */}
               <div className="flex-1 flex items-center justify-center p-8">
                  <div className="relative aspect-square max-h-full max-w-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-50"></div>
                     {/* Faux MRI visual */}
                     <div className="w-3/4 h-3/4 bg-slate-800/50 rounded-[40%] blur-xl animate-pulse"></div>
                     <div className="absolute top-4 left-4 text-xs font-mono text-cyan-500/70">
                        <p>Ahmed Youssef</p>
                        <p>MRN: 902181</p>
                        <p>DOB: 1978-04-12</p>
                     </div>
                     <div className="absolute top-4 right-4 text-xs font-mono text-cyan-500/70 text-right">
                        <p>MRI BRAIN W/O CONTRAST</p>
                        <p>Se: 3 / Im: 42</p>
                        <p>Axial T2 FSE</p>
                     </div>
                     <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-500/70">
                        <p>WL: 500 / WW: 1000</p>
                        <p>Zoom: 1.2x</p>
                     </div>
                  </div>
               </div>

               {/* Reporting Panel at Bottom */}
               <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col p-4">
                  <div className="flex justify-between items-center mb-2">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" /> {isAr ? "التقرير الشعاعي" : "Radiology Report"}
                     </h3>
                     <div className="flex gap-2">
                        <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition">Save Draft</button>
                        <button onClick={handleSignReport} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition">Sign Report</button>
                     </div>
                  </div>
                  <textarea 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:border-cyan-500 outline-none resize-none"
                    placeholder={isAr ? "اكتب التقرير هنا..." : "Findings: No acute intracranial abnormality..."}
                  ></textarea>
               </div>
            </div>
         </div>
      )}

      {activeTab === "orders" && (
         <div className="flex-1 p-6 bg-slate-50 text-slate-800">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                   <h3 className="font-bold text-slate-800 text-lg">{isAr ? "قائمة العمل (Worklist)" : "Department Worklist"}</h3>
                   <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold">New Order</button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">{isAr ? "الطلب" : "Order ID"}</th>
                        <th className="px-4 py-3">{isAr ? "المريض" : "Patient"}</th>
                        <th className="px-4 py-3">{isAr ? "نوع الفحص" : "Modality & Study"}</th>
                        <th className="px-4 py-3">{isAr ? "الطبيب" : "Ordering MD"}</th>
                        <th className="px-4 py-3">{isAr ? "الأهمية" : "Priority"}</th>
                        <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-600">{order.id}</td>
                          <td className="px-4 py-3 font-bold text-slate-800"><GlobalEntityLink entityId={order.mrn} entityName={order.patient} entityType="patient" isAr={isAr}>{order.patient}</GlobalEntityLink> <span className="text-xs text-slate-400 block">{order.mrn}</span></td>
                          <td className="px-4 py-3 font-bold text-slate-700">{order.type}</td>
                          <td className="px-4 py-3 text-slate-600">{order.doctor}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              order.priority === 'Urgent' || order.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                            }`}>{order.priority}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
         </div>
      )}
    </div>
  );
}
