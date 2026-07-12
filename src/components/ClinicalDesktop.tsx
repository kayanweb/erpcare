import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  User, 
  Calendar, 
  ArrowRight,
  ChevronLeft,
  Activity,
  FileText,
  Stethoscope,
  ClipboardList,
  Clock,
  TestTube,
  Pill,
  CreditCard,
  Building,
  BedDouble
} from "lucide-react";
import { Patient, AppUser } from "../types";
import { syncPatients } from "../lib/workflowService";
import { ClinicalDocumentation } from "./ClinicalDocumentation";
import { NursingConsole } from "./NursingConsole";
import { PatientWorkflowConsole } from "./PatientWorkflowConsole";
import { TaskCenter } from "./TaskCenter";
import { PatientTimeline } from "./PatientTimeline";
import { GlobalEntityLink } from "./GlobalEntityLink";

interface Props {
  currentUser: AppUser;
}

export const ClinicalDesktop: React.FC<Props> = ({ currentUser }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "flowsheets" | "notes" | "orders" | "medications" | "lab_rad" | "billing">("overview");

  useEffect(() => {
    const unsubscribe = syncPatients(setPatients);
    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.nameAr?.includes(searchTerm) || 
    p.mrn?.includes(searchTerm) || 
    p.nameEn?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  if (!selectedPatient) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600"></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Clinical Desktop</h2>
                <p className="text-slate-500 font-medium mt-2 max-w-xl leading-relaxed">
                  Comprehensive patient management hub. Search or select a patient to access full electronic medical records, interconnected entities, billing, and timelines.
                </p>
              </div>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search by MRN, Name, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-sm focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPatients.map(patient => (
                <button 
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all text-left group flex flex-col items-start gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-indigo-50" />
                  
                  <div className="flex w-full justify-between items-start relative z-10">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase">
                      {patient.currentWorkflowStage?.replace("_", " ") ?? ""}
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-full mt-2">
                    <h4 className="font-black text-slate-900 text-lg leading-tight truncate">{patient.nameAr}</h4>
                    <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">{patient.nameEn}</p>
                    <div className="flex gap-2 items-center mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">MRN</span>
                      <span className="text-xs font-black text-slate-700">{patient.mrn}</span>
                    </div>
                  </div>
                </button>
              ))}
              
              {filteredPatients.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                   <Users className="w-12 h-12 text-slate-300 mx-auto" />
                   <p className="text-slate-500 font-bold">No patients found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 h-[calc(100vh-8rem)] sticky top-6">
            <TaskCenter userRole={currentUser.role} userId={currentUser.id} />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "flowsheets", label: "Vitals & Flowsheets", icon: Stethoscope },
    { id: "notes", label: "Clinical Notes", icon: FileText },
    { id: "orders", label: "CPOE / Orders", icon: ClipboardList },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "lab_rad", label: "Lab & Rad", icon: TestTube },
    { id: "billing", label: "Billing", icon: CreditCard },
  ] as const;

  return (
    <div className="flex flex-col h-screen bg-slate-50 animate-in fade-in duration-500">
      {/* Patient Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm relative z-20 gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button 
            onClick={() => setSelectedPatient(null)}
            className="w-12 h-12 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner border border-indigo-200">
                {selectedPatient.nameEn.charAt(0)}
             </div>
             <div>
                <h3 className="font-black text-slate-900 text-xl leading-tight">{selectedPatient.nameAr} <span className="text-slate-400 font-medium text-base ml-2">{selectedPatient.nameEn}</span></h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                   <div className="flex items-center gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRN</span>
                     <span className="text-xs font-black text-slate-700">{selectedPatient.mrn}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DOB</span>
                     <span className="text-xs font-black text-slate-700">{selectedPatient.dob} ({selectedPatient.age} YRS)</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEX</span>
                     <span className="text-xs font-black text-slate-700 uppercase">{selectedPatient.gender}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                     <span className="text-xs font-black text-slate-700">{selectedPatient.phone}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Global Deep Links in Header */}
        <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner w-full md:w-auto overflow-x-auto hide-scrollbar">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Attending Physician</span>
            <GlobalEntityLink entityName="Dr. Ahmed Hassan" entityType="doctor" entityId="DOC-123" />
          </div>
          <div className="w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Location</span>
            <div className="flex gap-2 items-center">
              <GlobalEntityLink entityName="Internal Medicine" entityType="department" entityId="DEPT-IM" />
              <span className="text-slate-300">/</span>
              <GlobalEntityLink entityName="Room 402" entityType="room" entityId="RM-402" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-1 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                isActive 
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/50" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full max-w-[1600px] mx-auto flex flex-col gap-6">
           
           {activeSubTab === "overview" && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="lg:col-span-3 h-full overflow-hidden flex flex-col gap-6">
                 {/* Enterprise Entity Interconnectivity Panel */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-shrink-0">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Patient Profile & Related Entities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col">
                        <Building className="w-5 h-5 text-indigo-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</span>
                        <GlobalEntityLink entityName="Internal Medicine" entityType="department" entityId="DEPT-01" className="text-sm font-bold text-slate-700 mt-1" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col">
                        <BedDouble className="w-5 h-5 text-indigo-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bed / Room</span>
                        <GlobalEntityLink entityName="Bed 04 - Ward A" entityType="bed" entityId="BED-04" className="text-sm font-bold text-slate-700 mt-1" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col">
                        <User className="w-5 h-5 text-indigo-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Care Provider</span>
                        <GlobalEntityLink entityName="Dr. Sarah Johnson" entityType="doctor" entityId="DOC-44" className="text-sm font-bold text-slate-700 mt-1" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col">
                        <CreditCard className="w-5 h-5 text-indigo-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insurance Payer</span>
                        <GlobalEntityLink entityName="Bupa Global (Tier 1)" entityType="insurance" entityId="INS-01" className="text-sm font-bold text-slate-700 mt-1" />
                      </div>
                    </div>
                 </div>

                 {/* Patient Journey Flow */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                   <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Clinical Journey</h3>
                   </div>
                   <div className="p-4 overflow-y-auto flex-1">
                     <PatientWorkflowConsole 
                       patient={selectedPatient} 
                       staffId={currentUser.id} 
                       staffName={currentUser.nameAr}
                     />
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Audit & Timeline Log</h4>
                 </div>
                 <div className="p-4 overflow-y-auto flex-1">
                    <PatientTimeline workflowId={selectedPatient.workflowId || ""} />
                 </div>
               </div>
             </div>
           )}

           {activeSubTab === "flowsheets" && (
             <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
               <NursingConsole 
                 patient={selectedPatient} 
                 staffId={currentUser.id} 
               />
             </div>
           )}
           
           {activeSubTab === "notes" && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="lg:col-span-3 h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                   <ClinicalDocumentation 
                     patient={selectedPatient} 
                     workflowId={selectedPatient.workflowId || "temp"} 
                     staffId={currentUser.id} 
                     staffName={currentUser.nameAr}
                   />
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto flex flex-col gap-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Note History & Audit</h4>
                   <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-indigo-600 uppercase">SOAP Note</span>
                              <span className="text-[9px] font-bold text-slate-400">June 25, 10:30 AM</span>
                           </div>
                           <p className="text-xs text-slate-700 line-clamp-2 font-medium mb-3">Patient presented with severe abdominal pain and nausea. Vital signs are stable but requires continuous monitoring...</p>
                           <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                             <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[8px] font-bold">DR</div>
                             <GlobalEntityLink entityName="Dr. Ahmed" entityType="doctor" entityId="DOC-01" className="text-[10px]" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* Placeholder for newly added tabs to show Enterprise vastness */}
           {["orders", "medications", "lab_rad", "billing"]?.includes(activeSubTab) && (
             <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-300 rounded-3xl flex items-center justify-center mb-6">
                 {activeSubTab === "orders" && <ClipboardList className="w-10 h-10" />}
                 {activeSubTab === "medications" && <Pill className="w-10 h-10" />}
                 {activeSubTab === "lab_rad" && <TestTube className="w-10 h-10" />}
                 {activeSubTab === "billing" && <CreditCard className="w-10 h-10" />}
               </div>
               <h2 className="text-2xl font-black text-slate-800 mb-2 capitalize">{activeSubTab.replace("_", " & ")} Module</h2>
               <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                 This module is fully integrated into the enterprise ecosystem. You can access related entities, historical audit logs, and complete workflows from here.
               </p>
               <div className="flex gap-4">
                 <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition">
                   Initialize Module
                 </button>
                 <button className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-200 transition">
                   View Audit Logs
                 </button>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};
