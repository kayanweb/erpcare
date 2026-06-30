import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { BedDouble, CheckCircle2, AlertCircle, RefreshCcw, Search, Filter, ArrowRightLeft, UserCircle, MapPin, Activity, ShieldAlert, Wind, Building, Layers, Hotel, DoorOpen, Users, Key, HeartPulse, ClipboardList, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  language?: "ar" | "en";
  forceDepartmentId?: string;
}

export default function BedManagementDashboard({ language: propLanguage, forceDepartmentId }: Props = {}) {
  const { language: contextLanguage } = useHIS();
  const language = propLanguage || contextLanguage;
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'requests' | 'beds'>(forceDepartmentId ? 'beds' : 'requests');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(forceDepartmentId || 'all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedBedToAssign, setSelectedBedToAssign] = useState<string | null>(null);

  const transferRequests = [
    { 
      id: "TR-101", 
      patient: "Ahmed Ali", 
      mrn: "MRN-5521",
      age: 65,
      gender: "Male",
      currentLocation: "Emergency Department (ED-04)",
      requestedLocation: "ICU",
      reason: "Deteriorating respiratory condition, septic shock",
      priority: "high",
      requirements: ["ventilator", "continuous_monitoring"],
      status: "pending",
      time: "10 mins ago",
      requestedBy: "Dr. Kamel (ER)"
    },
    { 
      id: "TR-102", 
      patient: "Sara Mahmoud", 
      mrn: "MRN-9941",
      age: 28,
      gender: "Female",
      currentLocation: "Emergency Department (ED-12)",
      requestedLocation: "Internal Medicine",
      reason: "Fever of unknown origin, rule out infectious disease",
      priority: "medium",
      requirements: ["contact_isolation"],
      status: "pending",
      time: "25 mins ago",
      requestedBy: "Dr. Sarah (ER)"
    }
  ];

  // Hierarchical Bed Structure
  const hospitalStructure = [
    {
      id: "dept-im",
      name: "Internal Medicine",
      nameAr: "الباطنة",
      rooms: [
        { id: "room-201", name: "Room 201", type: "ward", gender: "Male", beds: [
          { id: "IM-201-A", status: "occupied", patient: "Omar Saeed", features: [] },
          { id: "IM-201-B", status: "available", patient: null, features: [] }
        ]},
        { id: "room-202", name: "Room 202 (Isolation)", type: "isolation", gender: "Any", beds: [
          { id: "IM-202-ISO", status: "needs_cleaning", patient: null, features: ["contact_isolation", "airborne_isolation", "negative_pressure"] }
        ]},
        { id: "room-203", name: "Room 203", type: "ward", gender: "Female", beds: [
          { id: "IM-203-A", status: "reserved", patient: "Fatima Khalid", features: [] },
          { id: "IM-203-B", status: "available", patient: null, features: [] }
        ]}
      ]
    },
    {
      id: "dept-icu",
      name: "Intensive Care Unit (ICU)",
      nameAr: "العناية المركزة",
      rooms: [
        { id: "room-icu-1", name: "ICU Bay 1", type: "critical", gender: "Any", beds: [
          { id: "ICU-01", status: "occupied", patient: "Hassan Ali", features: ["ventilator", "continuous_monitoring"] },
          { id: "ICU-02", status: "available", patient: null, features: ["ventilator", "continuous_monitoring"] }
        ]},
        { id: "room-icu-2", name: "ICU Bay 2", type: "critical", gender: "Any", beds: [
          { id: "ICU-03", status: "needs_cleaning", patient: null, features: ["continuous_monitoring"] },
          { id: "ICU-04", status: "occupied", patient: "Samir Nour", features: ["ventilator", "continuous_monitoring"] }
        ]}
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'occupied': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'needs_cleaning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reserved': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return isAr ? 'متاح' : 'Available';
      case 'occupied': return isAr ? 'مشغول' : 'Occupied';
      case 'needs_cleaning': return isAr ? 'تنظيف' : 'Cleaning';
      case 'reserved': return isAr ? 'محجوز' : 'Reserved';
      default: return status;
    }
  };

  const handleAssignBed = () => {
    toast.success(isAr ? `تم تخصيص السرير ${selectedBedToAssign} بنجاح. تم إشعار القسم المعني.` : `Bed ${selectedBedToAssign} assigned successfully. Ward notified.`);
    setSelectedRequest(null);
    setWizardStep(1);
    setSelectedBedToAssign(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-indigo-600">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-600" />
            {isAr ? "إدارة شؤون المرضى والأسرة (Bed Management)" : "Enterprise Bed Management"}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">{isAr ? "هيكلية المستشفى، التحكم في الإشغال، وطلبات النقل السريري" : "Hospital hierarchy, occupancy control, and clinical transfer workflows"}</p>
        </div>
        {!forceDepartmentId && (
          <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2.5 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              {isAr ? "الطلبات" : "Requests"}
              <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs">{transferRequests.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('beds')}
              className={`px-6 py-2.5 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'beds' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BedDouble className="w-4 h-4" />
              {isAr ? "خريطة المستشفى" : "Bed Board"}
            </button>
          </div>
        )}
      </div>

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-indigo-500" />
              {isAr ? "طلبات النقل المعلقة" : "Pending Transfer Requests"}
            </h3>
            {transferRequests.map(req => (
              <div 
                key={req.id} 
                onClick={() => { setSelectedRequest(req); setWizardStep(1); setSelectedBedToAssign(null); }}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedRequest?.id === req.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-slate-800 text-base">{req.patient}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold">{req.mrn}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{req.gender}, {req.age}yo</span>
                    </div>
                  </div>
                  {req.priority === 'high' && <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {isAr ? "عاجل" : "STAT"}</span>}
                </div>
                <div className="text-xs text-slate-600 mt-4 space-y-2 font-medium">
                  <div className="flex gap-2 p-2 bg-white rounded-lg border border-slate-100">
                    <div className="flex-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">{isAr ? "القسم الحالي" : "Current"}</p>
                      <p className="font-bold text-slate-700">{req.currentLocation}</p>
                    </div>
                    <ArrowRightLeft className="w-4 h-4 text-indigo-300 shrink-0 self-center" />
                    <div className="flex-1 text-right">
                      <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">{isAr ? "القسم المطلوب" : "Requested"}</p>
                      <p className="font-bold text-indigo-700">{req.requestedLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="xl:col-span-2">
            {selectedRequest ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in flex flex-col h-full">
                <div className="bg-slate-900 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block">Step {wizardStep} of 3</span>
                      <h3 className="font-black text-xl flex items-center gap-2 mt-1">
                        {isAr ? "سير عمل تخصيص السرير" : "Bed Assignment Workflow"}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{selectedRequest.patient} • {selectedRequest.mrn} • {selectedRequest.requestedLocation}</p>
                    </div>
                    <span className="font-mono text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">{selectedRequest.id}</span>
                  </div>
                  
                  {/* Wizard Progress Bar */}
                  <div className="flex gap-2 mt-6">
                    <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 1 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 3 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                  </div>
                </div>

                <div className="p-6 flex-1 bg-slate-50">
                  {wizardStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <h4 className="font-black text-slate-800 border-b border-slate-200 pb-2">{isAr ? "مراجعة الطلب السريري" : "1. Review Clinical Request"}</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{isAr ? "التشخيص وسبب النقل" : "Diagnosis & Reason"}</p>
                          <p className="text-sm font-bold text-slate-800">{selectedRequest.reason}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{isAr ? "الطبيب الطالب" : "Requested By"}</p>
                          <p className="text-sm font-bold text-slate-800">{selectedRequest.requestedBy}</p>
                          <p className="text-xs text-slate-500 mt-1">{selectedRequest.time}</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">{isAr ? "الاشتراطات السريرية (Mandatory)" : "Clinical Requirements (Mandatory)"}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.requirements.map((req: string) => (
                            <span key={req} className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                              {req === 'ventilator' ? <Wind className="w-4 h-4" /> : req === 'contact_isolation' ? <ShieldAlert className="w-4 h-4" /> : <HeartPulse className="w-4 h-4" />}
                              {req.replace('_', ' ').toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <button onClick={() => setWizardStep(2)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2">
                          {isAr ? "متابعة للبحث عن أسرة" : "Proceed to Find Bed"} <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <h4 className="font-black text-slate-800 border-b border-slate-200 pb-2">{isAr ? "الأسرة المطابقة (System Suggestions)" : "2. System Suggested Beds"}</h4>
                      
                      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-indigo-900 font-medium">
                          {isAr ? "قام النظام بفلترة الأسرة بناءً على: القسم المطلوب، توفر السرير، الجنس (لغرف المرضى المتعددين)، والاشتراطات السريرية (عزل/أجهزة)." : "The system has filtered beds based on: Requested Department, Availability, Gender (for multi-bed rooms), and Clinical Requirements (Isolation/Equipment)."}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* Mock algorithmic suggestion */}
                        <div 
                          onClick={() => setSelectedBedToAssign("BED-SUGGESTED")}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition ${selectedBedToAssign === "BED-SUGGESTED" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 bg-white hover:border-emerald-300"}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <BedDouble className="w-5 h-5 text-emerald-700" />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-800">{isAr ? "سرير مقترح" : "Suggested Bed"}</h5>
                                <p className="text-xs text-slate-500 font-bold">{selectedRequest.requestedLocation} • {isAr ? "متاح وجاهز" : "Available & Ready"}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <span className="bg-slate-100 text-slate-600 p-1.5 rounded" title="Continuous Monitoring"><HeartPulse className="w-4 h-4" /></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button onClick={() => setWizardStep(1)} className="text-slate-600 font-bold px-4 py-2 hover:bg-slate-200 rounded-lg transition">{isAr ? "رجوع" : "Back"}</button>
                        <button 
                          disabled={!selectedBedToAssign}
                          onClick={() => setWizardStep(3)} 
                          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50"
                        >
                          {isAr ? "متابعة" : "Proceed"}
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="space-y-6 animate-fade-in text-center py-8">
                      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-10 h-10 text-indigo-600" />
                      </div>
                      <h4 className="font-black text-2xl text-slate-800">{isAr ? "تأكيد تخصيص السرير" : "Confirm Bed Assignment"}</h4>
                      <p className="text-slate-600 max-w-md mx-auto">
                        {isAr ? `سيتم تخصيص السرير ${selectedBedToAssign} للمريض ${selectedRequest.patient}. سيتم إشعار قسم ${selectedRequest.requestedLocation} لاستقبال المريض.` : `You are about to assign bed ${selectedBedToAssign} to ${selectedRequest.patient}. The ${selectedRequest.requestedLocation} ward will be notified to receive the patient.`}
                      </p>
                      
                      <div className="flex justify-center gap-4 pt-6">
                        <button onClick={() => setWizardStep(2)} className="text-slate-600 font-bold px-6 py-3 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition">{isAr ? "تعديل السرير" : "Change Bed"}</button>
                        <button onClick={handleAssignBed} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> {isAr ? "تأكيد واعتماد (Sign)" : "Confirm & Sign"}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-10 bg-white shadow-sm min-h-[400px]">
                <ArrowRightLeft className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-bold">{isAr ? "اختر طلباً من القائمة لبدء سير العمل" : "Select a request to start the workflow"}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'beds' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          {!forceDepartmentId && (
            <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-100 pb-4">
               <div className="flex items-center gap-2">
                 <Filter className="w-5 h-5 text-slate-400" />
                 <select 
                   className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={selectedDepartment}
                   onChange={(e) => setSelectedDepartment(e.target.value)}
                 >
                   <option value="all">{isAr ? "عرض كل الأقسام" : "All Departments"}</option>
                   {hospitalStructure.map(dept => (
                     <option key={dept.id} value={dept.id}>{isAr ? dept.nameAr : dept.name}</option>
                   ))}
                 </select>
               </div>
               <div className="flex gap-2 flex-wrap items-center">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {isAr ? "متاح" : "Available"}</span>
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> {isAr ? "مشغول" : "Occupied"}</span>
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> {isAr ? "تنظيف" : "Cleaning"}</span>
               </div>
            </div>
          )}
          
          <div className="space-y-8 mt-6">
            {hospitalStructure.filter(d => selectedDepartment === 'all' || d.id === selectedDepartment).map(dept => (
              <div key={dept.id} className="animate-fade-in">
                <h3 className="font-black text-xl text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
                  {isAr ? dept.nameAr : dept.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dept.rooms.map(room => (
                    <div key={room.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                        <div>
                          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                            <DoorOpen className="w-4 h-4 text-slate-500" /> {room.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                            Type: {room.type} • Gender: {room.gender}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {room.beds.map(bed => (
                          <div key={bed.id} className={`p-3 rounded-xl border-2 ${getStatusColor(bed.status)} flex flex-col justify-between shadow-sm relative overflow-hidden group min-h-[100px]`}>
                            <div className="flex justify-between items-start">
                              <h5 className="font-black text-sm">{bed.id}</h5>
                              {bed.features.length > 0 && (
                                <div className="flex gap-0.5">
                                  {bed.features.includes("ventilator") && <Wind className="w-3.5 h-3.5 opacity-60" title="Ventilator Support" />}
                                  {bed.features.includes("contact_isolation") && <ShieldAlert className="w-3.5 h-3.5 opacity-60 text-purple-700" title="Isolation" />}
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{getStatusLabel(bed.status)}</p>
                              {bed.patient ? (
                                <p className="text-xs font-black truncate">{bed.patient}</p>
                              ) : (
                                <p className="text-xs font-medium opacity-50">-</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

