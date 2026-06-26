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
  Clock
} from "lucide-react";
import { Patient, AppUser } from "../types";
import { syncPatients } from "../lib/workflowService";
import { ClinicalDocumentation } from "./ClinicalDocumentation";
import { NursingConsole } from "./NursingConsole";
import { PatientWorkflowConsole } from "./PatientWorkflowConsole";
import { TaskCenter } from "./TaskCenter";
import { PatientTimeline } from "./PatientTimeline";

interface Props {
  currentUser: AppUser;
}

export const ClinicalDesktop: React.FC<Props> = ({ currentUser }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"journey" | "notes" | "nursing">("journey");

  useEffect(() => {
    const unsubscribe = syncPatients(setPatients);
    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.nameAr.includes(searchTerm) || 
    p.mrn.includes(searchTerm) || 
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedPatient) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Desktop</h2>
                <p className="text-slate-500 font-medium mt-1">Select a patient to manage their clinical journey and documentation.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="MRN or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPatients.map(patient => (
                <button 
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left group flex flex-col items-start gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-indigo-50" />
                  
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors relative z-10">
                    <User className="w-7 h-7" />
                  </div>
                  
                  <div className="relative z-10">
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{patient.nameAr}</h4>
                    <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">MRN: {patient.mrn}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors relative z-10">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{patient.currentWorkflowStage.replace("_", " ")}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 relative z-10">
                    Open Profile <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
              
              {filteredPatients.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                   <Users className="w-12 h-12 text-slate-300 mx-auto" />
                   <p className="text-slate-400 font-bold">No patients found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 h-[calc(100vh-8rem)]">
            <TaskCenter userRole={currentUser.role} userId={currentUser.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Patient Header Bar */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSelectedPatient(null)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center font-black text-xl">
                {selectedPatient.nameEn.charAt(0)}
             </div>
             <div>
                <h3 className="font-black text-slate-900 leading-tight">{selectedPatient.nameAr}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRN: {selectedPatient.mrn}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DOB: {selectedPatient.dob}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEX: {selectedPatient.gender}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setActiveSubTab("journey")}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === "journey" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
           >
             <Activity className="w-3.5 h-3.5" />
             Patient Journey
           </button>
           <button 
             onClick={() => setActiveSubTab("notes")}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === "notes" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
           >
             <FileText className="w-3.5 h-3.5" />
             Clinical Notes
           </button>
           <button 
             onClick={() => setActiveSubTab("nursing")}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === "nursing" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
           >
             <Stethoscope className="w-3.5 h-3.5" />
             Nursing Console
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
           {activeSubTab === "journey" && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
               <div className="lg:col-span-3 h-full overflow-hidden">
                 <PatientWorkflowConsole 
                   patient={selectedPatient} 
                   staffId={currentUser.id} 
                   staffName={currentUser.nameAr}
                 />
               </div>
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
                 <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مسار الزيارة (Timeline)</h4>
                 </div>
                 <PatientTimeline workflowId={selectedPatient.workflowId || ""} />
               </div>
             </div>
           )}
           
           {activeSubTab === "notes" && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
                <div className="lg:col-span-3 h-full overflow-hidden">
                   <ClinicalDocumentation 
                     patient={selectedPatient} 
                     workflowId={selectedPatient.workflowId || "temp"} 
                     staffId={currentUser.id} 
                     staffName={currentUser.nameAr}
                   />
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Note History</h4>
                   <div className="space-y-4">
                      {[1,2].map(i => (
                        <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                           <div className="flex justify-between items-start mb-1">
                              <span className="text-[9px] font-black text-pink-600 uppercase">SOAP Note</span>
                              <span className="text-[9px] font-medium text-slate-400">June 25, 10:30</span>
                           </div>
                           <p className="text-xs text-slate-700 line-clamp-2 font-medium">Patient presented with severe abdominal pain and nausea...</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeSubTab === "nursing" && (
             <NursingConsole 
               patient={selectedPatient} 
               staffId={currentUser.id} 
             />
           )}
        </div>
      </div>
    </div>
  );
};
