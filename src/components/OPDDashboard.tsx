import React, { useState } from "react";
import { Search, Plus, Calendar, Activity, Clock, Video, CreditCard, User, Filter, MoreVertical, FileText, CheckCircle2 } from "lucide-react";
import { useHIS, Patient } from "../context/HISContext";

export default function OPDDashboard({ language }: { language: string }) {
  const isAr = language === "ar";
  const { patients, updatePatientStatus, updatePatient, addPatient } = useHIS();
  const [activeTab, setActiveTab] = useState<"visits" | "diagnosis" | "timeline" | "live_consultation" | "billing">("visits");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPatient, setNewPatient] = useState({ nameEn: "", nameAr: "", phone: "", gender: "Male", age: "" });

  const opdPatients = patients.filter(p => p.status === 'registered' || p.status === 'triage' || p.status === 'doctor' || p.status === 'opd');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleAddPatient = async () => {
    if (!newPatient.nameEn || !newPatient.phone) return;
    const patientRecord: any = {
      id: "OPD-" + Date.now(),
      mrn: "MRN-" + Math.floor(Math.random() * 10000),
      nameEn: newPatient.nameEn,
      nameAr: newPatient.nameAr || newPatient.nameEn,
      age: Number(newPatient.age) || 30,
      gender: newPatient.gender,
      phone: newPatient.phone,
      status: "opd",
      insurance: "Cash",
      visits: [{
        id: "V-" + Date.now(),
        date: new Date().toISOString(),
        consultant: "Dr. George Brown",
        status: "waiting"
      }],
      diagnoses: [],
      bills: []
    };
    addPatient(patientRecord);
    setIsAddingNew(false);
    setNewPatient({ nameEn: "", nameAr: "", phone: "", gender: "Male", age: "" });
  };

  const filteredPatients = opdPatients.filter(
    (p) =>
      p.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr?.includes(searchQuery) ||
      p.mrn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`h-full flex flex-col ${isAr ? "rtl" : "ltr"}`}>
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Sidebar (Patient List) */}
        <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 ${(selectedPatient || isAddingNew) ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-slate-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">{isAr ? "مرضى العيادات" : "OPD Patients"}</h2>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث بالاسم أو MRN..." : "Search by name or MRN..."}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2 ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredPatients.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">{isAr ? "لا يوجد مرضى" : "No patients found"}</div>
            ) : (
              filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedPatient?.id === p.id
                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${selectedPatient?.id === p.id ? "text-indigo-900" : "text-slate-800"}`}>
                      {isAr ? p.nameAr : p.nameEn}
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{p.mrn}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {p.gender}, {p.age}</span>
                    <span>{p.phone}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col bg-slate-50 min-w-0 overflow-y-auto ${(selectedPatient || isAddingNew) ? "flex" : "hidden md:flex"}`}>
          {isAddingNew ? (
            <div className="p-8 max-w-2xl mx-auto w-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{isAr ? "تسجيل مريض عيادة جديد" : "Register New OPD Patient"}</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{isAr ? "الاسم (انجليزي)" : "Name (English)"}</label>
                    <input type="text" value={newPatient.nameEn} onChange={e => setNewPatient({...newPatient, nameEn: e.target.value})} className="w-full border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{isAr ? "الاسم (عربي)" : "Name (Arabic)"}</label>
                    <input type="text" value={newPatient.nameAr} onChange={e => setNewPatient({...newPatient, nameAr: e.target.value})} className="w-full border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
                    <input type="text" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} className="w-full border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{isAr ? "العمر" : "Age"}</label>
                    <input type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="w-full border p-2 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleAddPatient} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">{isAr ? "حفظ" : "Save"}</button>
                  <button onClick={() => setIsAddingNew(false)} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200">{isAr ? "إلغاء" : "Cancel"}</button>
                </div>
              </div>
            </div>
          ) : selectedPatient ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0 z-10 sticky top-0 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                  <button onClick={() => { setSelectedPatientId(null); setIsAddingNew(false); }} className="md:hidden mr-2 p-2 rounded-lg bg-slate-100 text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-indigo-200 shadow-sm">
                      {selectedPatient.nameEn.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-800">{isAr ? selectedPatient.nameAr : selectedPatient.nameEn}</h1>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500 font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">{selectedPatient.mrn}</span>
                        <span>•</span>
                        <span>{selectedPatient.gender}, {selectedPatient.age} yrs</span>
                        <span>•</span>
                        <span>{selectedPatient.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition border border-emerald-200">
                      {isAr ? "بدء الزيارة" : "Start Visit"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 border-b border-slate-200 bg-white sticky top-[96px] z-10">
                <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
                  {[
                    { id: "visits", label: isAr ? "الزيارات" : "Visits", icon: Calendar },
                    { id: "diagnosis", label: isAr ? "التشخيص" : "Diagnosis", icon: Activity },
                    { id: "billing", label: isAr ? "الفواتير" : "Billing", icon: CreditCard },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 flex-1 max-w-5xl mx-auto w-full">
                {activeTab === "visits" && (
                  <div className="space-y-4">
                    {selectedPatient.visits && selectedPatient.visits.length > 0 ? (
                      selectedPatient.visits.map((v: any) => (
                        <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-slate-800">Visit {v.id}</h3>
                              <p className="text-sm text-slate-500">{new Date(v.date).toLocaleString()}</p>
                            </div>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wide">
                              {v.status}
                            </span>
                          </div>
                          <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Consultant</p>
                            <p className="text-sm font-medium text-slate-800">{v.consultant}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-500">{isAr ? "لا توجد زيارات" : "No visits recorded"}</div>
                    )}
                  </div>
                )}
                {activeTab === "diagnosis" && (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "لا يوجد تشخيص" : "No Diagnoses"}</h3>
                    <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 inline-flex items-center gap-2">
                      <Plus className="w-4 h-4" /> {isAr ? "إضافة" : "Add New"}
                    </button>
                  </div>
                )}
                {activeTab === "billing" && (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-4 text-xs font-medium text-slate-500 uppercase">Item</th>
                          <th className="p-4 text-xs font-medium text-slate-500 uppercase text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-4 text-sm text-slate-800 font-medium">Consultation Fee</td>
                          <td className="p-4 text-sm text-slate-800 font-mono text-right">$150.00</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">Total</td>
                          <td className="p-4 font-bold text-indigo-600 text-right font-mono">$150.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <User className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-lg font-medium">{isAr ? "يرجى اختيار مريض من القائمة" : "Please select a patient from the list"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
