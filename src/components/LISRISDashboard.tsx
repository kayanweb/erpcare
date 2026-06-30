import React, { useState } from "react";
import { Microscope, TestTube, HardDrive, Printer, CheckCircle2, QrCode, FileText, Share2, Search, Zap, Check, AlertCircle } from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function LISRISDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"lis" | "ris">("lis");
  
  // States for Lab
  const [labSubTab, setLabSubTab] = useState<"orders" | "catalog" | "results">("orders");
  const [radSubTab, setRadSubTab] = useState<"worklist" | "reporting">("worklist");
  const [labSearchTerm, setLabSearchTerm] = useState("");

  const { patients, updatePatient } = useHIS();

  // Aggregate orders from all patients
  const allOrders = patients.flatMap(p => 
    (p.orders || []).map((o: any) => ({ ...o, patientId: p.id, patientName: isAr ? p.nameAr : p.nameEn, patientMrn: p.mrn }))
  );

  const labOrders = allOrders.filter(o => o.type === "LAB");
  const radOrders = allOrders.filter(o => o.type === "RAD");

  const filteredLabOrders = labOrders.filter(order => {
    const q = labSearchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (order.name && order.name.toLowerCase().includes(q)) ||
      (order.patientName && order.patientName.toLowerCase().includes(q)) ||
      (order.patientMrn && order.patientMrn.toLowerCase().includes(q))
    );
  });

  const pendingLab = labOrders.filter(o => o.status === "Ordered" || o.status === "Pending");
  const completedLab = labOrders.filter(o => o.status === "Completed");

  const handleUpdateOrderStatus = (patientId: string, orderId: string, newStatus: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient || !patient.orders) return;
    
    const updatedOrders = patient.orders.map((o: any) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );

    updatePatient(patientId, { orders: updatedOrders });
    toast.success(isAr ? `تم تحديث الحالة إلى ${newStatus}` : `Order marked as ${newStatus}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 border-b border-slate-200 shrink-0">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Microscope className="h-7 w-7 text-purple-600" />
          {isAr ? "المختبر والأشعة (LIS/RIS)" : "Laboratory & Radiology"}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {isAr ? "إدارة طلبات المعمل والأشعة، النتائج والتقارير" : "Manage Lab and Radiology orders, results, and reporting"}
        </p>

        <div className="flex mt-6 gap-6 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab("lis")}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === "lis" ? "text-purple-600 border-b-2 border-purple-600" : "text-slate-500 hover:text-slate-800"}`}
          >
            <TestTube className="w-4 h-4" /> {isAr ? "المختبر (Laboratory)" : "Laboratory"}
          </button>
          <button 
            onClick={() => setActiveTab("ris")}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === "ris" ? "text-purple-600 border-b-2 border-purple-600" : "text-slate-500 hover:text-slate-800"}`}
          >
            <HardDrive className="w-4 h-4" /> {isAr ? "الأشعة (Radiology)" : "Radiology"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === "lis" && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button onClick={() => setLabSubTab("orders")} className={`px-4 py-2 text-xs font-bold rounded-lg ${labSubTab === "orders" ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{isAr ? "الطلبات (Lab Orders)" : "Lab Orders"}</button>
              <button onClick={() => setLabSubTab("results")} className={`px-4 py-2 text-xs font-bold rounded-lg ${labSubTab === "results" ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{isAr ? "إدخال النتائج (Result Entry)" : "Result Entry"}</button>
              <button onClick={() => setLabSubTab("catalog")} className={`px-4 py-2 text-xs font-bold rounded-lg ${labSubTab === "catalog" ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{isAr ? "كتالوج التحاليل (Test Catalog)" : "Test Catalog"}</button>
            </div>

            {labSubTab === "orders" && (
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
                  <div className="w-full md:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
                    <div className="p-3 border-b border-slate-200">
                      <div className="flex gap-2 text-[10px] font-bold mb-3 flex-wrap">
                         <span className="bg-white px-2 py-1 border border-slate-200 rounded text-amber-600">Pending ({pendingLab.length})</span>
                         <span className="bg-white px-2 py-1 border border-slate-200 rounded text-emerald-600">Completed ({completedLab.length})</span>
                      </div>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                        <input 
                          type="text" 
                          placeholder="Search orders..." 
                          value={labSearchTerm}
                          onChange={(e) => setLabSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 outline-none focus:border-purple-500" 
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                       {filteredLabOrders.length > 0 ? filteredLabOrders.map((order, idx) => (
                         <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300">
                            <div className="flex justify-between items-start mb-1">
                               <span className="font-bold text-slate-800 text-xs">{order.name}</span>
                               <span className={`text-[9px] px-1 rounded font-bold ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mb-2">{order.patientName} ({order.patientMrn})</div>
                            <div className="text-[10px] text-slate-400">Date: {order.date}</div>
                         </div>
                       )) : (
                         <div className="text-center text-xs text-slate-500 p-4">No lab orders found.</div>
                       )}
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white">
                     {pendingLab.length > 0 ? (
                       <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-2">Process Sample</h3>
                          <p className="text-xs text-slate-500 mb-6">Patient: {pendingLab[0].patientName} ({pendingLab[0].patientMrn})<br/>Test: {pendingLab[0].name}</p>
                          
                          <div className="flex flex-col gap-3">
                             <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs shadow-sm">
                               <QrCode className="w-4 h-4" /> Print Barcode
                             </button>
                             <button onClick={() => handleUpdateOrderStatus(pendingLab[0].patientId, pendingLab[0].id, "Completed")} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs shadow-sm">
                               <CheckCircle2 className="w-4 h-4" /> Mark Collected & Completed
                             </button>
                          </div>
                       </div>
                     ) : (
                       <div className="text-slate-500 font-bold text-sm">Select an order to process</div>
                     )}
                  </div>
               </div>
            )}

            {labSubTab === "results" && (
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                 <div className="flex justify-between items-center mb-6">
                   <div>
                     <h3 className="font-bold text-slate-800">Result Entry: Complete Blood Count</h3>
                     <p className="text-xs text-slate-500">Select a completed lab order from the left to enter detailed results</p>
                   </div>
                   <div className="flex gap-2">
                     <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-50 flex items-center gap-1"><Printer className="w-3.5 h-3.5"/> Print Result</button>
                     <button className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-purple-700 flex items-center gap-1"><Check className="w-3.5 h-3.5"/> Approve Result</button>
                   </div>
                 </div>

                 <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                      <tr>
                        <th className="py-2 px-4 font-bold text-start">Test Parameter</th>
                        <th className="py-2 px-4 font-bold text-start">Result</th>
                        <th className="py-2 px-4 font-bold text-start">Unit</th>
                        <th className="py-2 px-4 font-bold text-start">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-700">WBC</td>
                        <td className="py-3 px-4"><input type="number" defaultValue="7.2" className="w-20 border border-slate-200 rounded p-1 text-center outline-none focus:border-purple-500" /></td>
                        <td className="py-3 px-4 text-slate-400">10^9/L</td>
                        <td className="py-3 px-4 text-slate-500">4.5 - 11.0</td>
                      </tr>
                      <tr className="bg-rose-50/30">
                        <td className="py-3 px-4 font-bold text-slate-700 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-rose-500"/> Hemoglobin</td>
                        <td className="py-3 px-4"><input type="number" defaultValue="9.5" className="w-20 border border-rose-300 bg-rose-100 text-rose-700 font-black rounded p-1 text-center outline-none focus:border-rose-500" /></td>
                        <td className="py-3 px-4 text-slate-400">g/dL</td>
                        <td className="py-3 px-4 text-slate-500">13.5 - 17.5</td>
                      </tr>
                    </tbody>
                 </table>
               </div>
            )}

            {labSubTab === "catalog" && (
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800">Test Catalog</h3>
                   <button className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-purple-700">Add Test</button>
                 </div>
                 <div className="text-sm text-slate-500">Catalog management UI (Add, Edit, Delete) goes here...</div>
               </div>
            )}
          </div>
        )}

        {activeTab === "ris" && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button onClick={() => setRadSubTab("worklist")} className={`px-4 py-2 text-xs font-bold rounded-lg ${radSubTab === "worklist" ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{isAr ? "قائمة العمل (Worklist)" : "Worklist"}</button>
              <button onClick={() => setRadSubTab("reporting")} className={`px-4 py-2 text-xs font-bold rounded-lg ${radSubTab === "reporting" ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{isAr ? "التقارير (Reporting)" : "Reporting"}</button>
            </div>

            {radSubTab === "worklist" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800">Modality Worklist (MWL)</h3>
                   <div className="flex gap-2 text-xs">
                      <select className="border border-slate-200 rounded p-1.5 outline-none font-bold bg-slate-50 text-slate-700">
                        <option>All Modalities</option>
                        <option>X-Ray</option>
                        <option>CT</option>
                        <option>MRI</option>
                        <option>US</option>
                      </select>
                   </div>
                 </div>
                 <table className="w-full text-sm border-collapse" dir={isAr ? "rtl" : "ltr"}>
                    <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                      <tr>
                        <th className="py-2 px-4 font-bold text-start">Time</th>
                        <th className="py-2 px-4 font-bold text-start">Patient</th>
                        <th className="py-2 px-4 font-bold text-start">Modality</th>
                        <th className="py-2 px-4 font-bold text-start">Exam</th>
                        <th className="py-2 px-4 font-bold text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {radOrders.length > 0 ? radOrders.map((order, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono">{order.date}</td>
                          <td className="py-3 px-4 font-bold">{order.patientName} ({order.patientMrn})</td>
                          <td className="py-3 px-4 font-bold text-purple-600">RAD</td>
                          <td className="py-3 px-4">{order.name} <span className={`text-[9px] px-1 rounded ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{order.status}</span></td>
                          <td className="py-3 px-4 text-end">
                            {order.status !== 'Completed' && (
                              <button onClick={() => handleUpdateOrderStatus(order.patientId, order.id, "Completed")} className="bg-amber-100 text-amber-700 px-3 py-1 rounded font-bold hover:bg-amber-200 transition">End Exam</button>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-500 font-bold">No radiology orders found.</td>
                        </tr>
                      )}
                    </tbody>
                 </table>
              </div>
            )}

            {radSubTab === "reporting" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[600px]">
                 <div className="flex justify-between items-center mb-4 shrink-0">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Radiology Reporting</h3>
                      <p className="text-xs text-slate-500">Select an exam from the worklist to report on.</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5"/> Share PACS Link</button>
                       <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"><Printer className="w-3.5 h-3.5"/> Print</button>
                       <button className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 flex items-center gap-1.5">Save & Sign</button>
                    </div>
                 </div>

                 <div className="flex gap-4 flex-1 overflow-hidden">
                    <div className="w-64 border border-slate-200 rounded-lg bg-slate-50 flex flex-col p-3 shrink-0">
                       <h4 className="font-bold text-xs text-slate-600 mb-2 uppercase">Templates</h4>
                       <div className="space-y-1">
                         <div className="p-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded cursor-pointer">Normal Chest X-Ray</div>
                         <div className="p-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded cursor-pointer">Normal MRI Brain</div>
                         <div className="p-2 text-xs font-bold text-purple-700 bg-purple-100 rounded cursor-pointer">MRI Lumbar Spine</div>
                       </div>
                    </div>
                    <div className="flex-1 flex flex-col border border-slate-200 rounded-lg overflow-hidden">
                       <div className="bg-slate-100 p-2 flex gap-2 border-b border-slate-200 shrink-0">
                          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 font-bold text-[10px] flex items-center gap-1"><Zap className="w-3 h-3"/> Voice to Text</button>
                          <div className="w-px h-5 bg-slate-300 mx-1 self-center"></div>
                          <button className="p-1 px-2 font-bold text-xs hover:bg-slate-200 rounded">B</button>
                          <button className="p-1 px-2 italic text-xs hover:bg-slate-200 rounded">I</button>
                          <button className="p-1 px-2 underline text-xs hover:bg-slate-200 rounded">U</button>
                       </div>
                       <textarea className="flex-1 p-4 outline-none resize-none text-sm font-serif" defaultValue="FINDINGS:&#10;Alignment is normal. Vertebral body heights are maintained. No acute fracture. Bone marrow signal is unremarkable.&#10;&#10;IMPRESSION:&#10;Unremarkable MRI of the lumbar spine."></textarea>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
