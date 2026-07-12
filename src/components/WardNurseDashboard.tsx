import React, { useState, useEffect } from "react";
import { BedDouble, ShieldAlert, HeartPulse, User, AlertTriangle, AlertCircle, Hand, Pill, Droplet, Users, Bed, Building, LayoutList, ListTodo, FileText, CheckCircle2, Clock, X, Check, FileEdit, Activity, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { PatientChartModal } from "./PatientChartModal";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { HOSPITAL_WARDS } from "../lib/constants";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
  forceDepartmentId?: string;
}

export default function WardNurseDashboard({ language, forceDepartmentId }: Props) {
  const isAr = language === "ar";
  const { patients: contextPatients, bedMap } = useHIS();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(forceDepartmentId || "dept-im-m");
  const activeWardPatients = contextPatients.filter(p => 
    (p.status === "ward" || p.status === "admitted") && 
    (p.wardId === selectedDepartment || p.departmentId === selectedDepartment)
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [initialPatientTab, setInitialPatientTab] = useState<string>("summary");
  const [taskCenterPatient, setTaskCenterPatient] = useState<any | null>(null);
  const [activeTaskCategory, setActiveTaskCategory] = useState<string>("mar");
  const [activeTab, setActiveTab] = useState<"beds" | "tasks">("beds");

  const departments = HOSPITAL_WARDS;

  const taskCategories = [
    { id: "mar", icon: Pill, label: "Medication Administration", labelAr: "إعطاء الأدوية (MAR)" },
    { id: "vitals", icon: HeartPulse, label: "Vital Signs", labelAr: "العلامات الحيوية" },
    { id: "io", icon: Droplet, label: "Intake & Output", labelAr: "السوائل (I&O)" },
    { id: "orders", icon: FileText, label: "Doctor Orders", labelAr: "أوامر الطبيب" },
    { id: "assessments", icon: ShieldAlert, label: "Nursing Assessments", labelAr: "التقييمات التمريضية" },
  ];

  // Initialize Bed Map if empty
  useEffect(() => {
    // Bed map is now synced from the backend, no local mock overwrite
  }, []);

  const currentWardRooms = [
    {
      roomId: "Room 201",
      beds: ["Bed A", "Bed B"].map(id => ({ bedId: id, ...(bedMap[id] || { status: 'available' }) }))
    },
    {
      roomId: "Room 202 (Isolation)",
      beds: ["Bed ISO", "Bed C"].map(id => ({ bedId: id, ...(bedMap[id] || { status: 'available' }) }))
    },
    {
      roomId: "Room 203",
      beds: ["Bed D"].map(id => ({ bedId: id, ...(bedMap[id] || { status: 'available' }) }))
    }
  ];

  const handleTaskComplete = (taskId: string) => {
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Task completed successfully", titleAr: "تم إنجاز المهمة بنجاح", type: "form" } }));
  };



  return (
    <div className="p-4 md:p-6 bg-slate-50 h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-s-4 border-s-sky-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <LayoutList className="h-7 w-7 text-sky-600" />
            {isAr ? "محطة عمل التمريض (Nursing Workstation)" : "Nursing Workstation"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة المهام التمريضية حسب الجناح والغرفة" : "Ward-based nursing task management and clinical operations"}
          </p>
        </div>
        
        <div className="flex gap-2">
          {!forceDepartmentId && (
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
             <Building className="w-5 h-5 text-slate-400" />
             <select 
               className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer"
               value={selectedDepartment}
               onChange={(e) => setSelectedDepartment(e.target.value)}
             >
               {(departments || []).map(d => (
                 <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
               ))}
             </select>
           </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6" dir={isAr ? "rtl" : "ltr"}>
        <button
          onClick={() => setActiveTab("beds")}
          className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
            activeTab === "beds" ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <BedDouble className="w-4 h-4" /> {isAr ? "لوحة الأسرة" : "Bed Board"}
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
            activeTab === "tasks" ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <ClipboardList className="w-4 h-4" /> {isAr ? "المهام السريرية" : "Clinical Tasks"}
        </button>
      </div>

      {activeTab === "tasks" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <DepartmentTasks language={language} departmentId={selectedDepartment} departmentName={isAr ? "جناح التنويم" : "Inpatient Ward"} />
        </div>
      ) : (
        <div className="space-y-6">
          {currentWardRooms.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
              <Bed className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {isAr ? "لا توجد أسرة في هذا القسم" : "No beds configured for this department"}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(currentWardRooms || []).map((room: any) => (
                <div key={room.roomId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Users className="w-5 h-5 text-indigo-500" /> {room.roomId}
                  </h3>
                  <div className="space-y-3">
                    {(room.beds || []).map((bed: any) => (
                      <div 
                        key={bed.bedId} 
                        className={`border-2 rounded-xl p-4 transition
                        ${bed.status === 'occupied' ? 'border-sky-200 bg-sky-50' : 
                          bed.status === 'cleaning' ? 'border-amber-200 bg-amber-50' : 
                          'border-dashed border-slate-300 bg-slate-50'}`}
                      >
                      {bed.status === 'occupied' ? (
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white shadow-sm border border-sky-100 rounded-full flex items-center justify-center shrink-0">
                                   <User className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-slate-800 text-sm">
                                     <GlobalEntityLink entityId={bed.mrn} entityName={bed.patientName} entityType="patient" isAr={isAr}>
                                       {bed.patientName}
                                     </GlobalEntityLink>
                                   </h4>
                                   <div className="flex items-center gap-1 mt-0.5">
                                     <span className="text-[10px] font-mono font-bold text-slate-500">{bed.bedId}</span>
                                   </div>
                                </div>
                             </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-400">
                          <Bed className="w-6 h-6 opacity-40" />
                          <div>
                            <span className="font-bold text-sm text-slate-600 block">{bed.bedId}</span>
                            <span className="text-xs">{isAr ? "فارغ / متاح" : "Empty / Available"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Task Center Modal */}
      {taskCenterPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black">{isAr ? "مركز المهام التمريضية" : "Nursing Task Center"}</h2>
                  <p className="text-sm text-slate-300 mt-1">{taskCenterPatient.patientName} • {taskCenterPatient.bedId}</p>
                </div>
              </div>
              <button onClick={() => setTaskCenterPatient(null)} className="p-2 hover:bg-white/10 rounded-xl transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Task Categories Sidebar */}
              <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
                {(taskCategories || []).map(cat => {
                  const Icon = cat.icon;
                  const taskCount = taskCenterPatient.tasks[cat.id] || 0;
                  const isActive = activeTaskCategory === cat.id;
                  
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveTaskCategory(cat.id)}
                      className={`flex items-center justify-between p-4 border-b border-slate-100 transition text-left ${isActive ? 'bg-white border-s-4 border-s-sky-500 shadow-sm relative z-10' : 'hover:bg-slate-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                          {isAr ? cat.labelAr : cat.label}
                        </span>
                      </div>
                      {taskCount > 0 && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>
                          {taskCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Task List Content */}
              <div className="flex-1 bg-white p-6 overflow-y-auto">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  {isAr ? taskCategories.find(c => c.id === activeTaskCategory)?.labelAr : taskCategories.find(c => c.id === activeTaskCategory)?.label}
                </h3>
                
                {activeTaskCategory === "mar" && (
                  <div className="space-y-4">
                    <div className="p-4 border border-rose-200 bg-rose-50 rounded-xl flex items-start gap-4 hover:shadow-md transition">
                      <div className="bg-white p-2 rounded-lg border border-rose-100 shrink-0">
                        <Clock className="w-6 h-6 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-rose-900 text-lg">Ceftriaxone 1g IV</h4>
                            <p className="text-sm font-bold text-rose-700 mt-1">Due: 08:00 AM • Q12H</p>
                          </div>
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Overdue</span>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button 
                            onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Edit Medication Order", titleAr: "تعديل طلب الدواء", type: "form" } }))}
                            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            {isAr ? "تعديل" : "Edit"}
                          </button>
                          <button onClick={() => handleTaskComplete("med-1")} className="bg-rose-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-rose-700 transition text-xs flex items-center gap-2">
                            <Check className="w-3.5 h-3.5" />
                            {isAr ? "إعطاء وتوقيع" : "Administer & Sign"}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-slate-200 bg-white rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0">
                        <Pill className="w-6 h-6 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">Pantoprazole 40mg PO</h4>
                            <p className="text-sm font-bold text-slate-500 mt-1">Due: 14:00 PM • OD</p>
                          </div>
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Routine</span>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button 
                            onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Edit Medication Order", titleAr: "تعديل طلب الدواء", type: "form" } }))}
                            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            {isAr ? "تعديل" : "Edit"}
                          </button>
                          <button onClick={() => handleTaskComplete("med-2")} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-slate-900 transition text-xs flex items-center gap-2">
                            <Check className="w-3.5 h-3.5" />
                            {isAr ? "إعطاء وتوقيع" : "Administer & Sign"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTaskCategory === "vitals" && (
                  <div className="p-8 border-2 border-dashed border-sky-200 bg-sky-50/50 rounded-2xl text-center group hover:bg-sky-50 transition">
                     <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition mb-6">
                       <HeartPulse className="w-10 h-10 text-sky-500" />
                     </div>
                     <p className="text-slate-700 font-bold text-lg mb-2">{isAr ? "إدخال العلامات الحيوية مجدول الساعة 14:00" : "Vital signs scheduled for 14:00"}</p>
                     <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{isAr ? "يرجى تسجيل العلامات الحيوية بشكل دقيق لتحديث ملف المريض وحالته" : "Please record vital signs accurately to update the patient's chart and status"}</p>
                     <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 mx-auto">
                       <Activity className="w-5 h-5" />
                       {isAr ? "إدخال وتوثيق الآن" : "Record & Sign Now"}
                     </button>
                  </div>
                )}
                
                {/* Other categories would follow similar patterns */}
                {["io", "orders", "assessments"]?.includes(activeTaskCategory) && (
                   <div className="text-slate-500 text-center py-10 font-medium">
                     {isAr ? "المهام الخاصة بهذا القسم ستظهر هنا." : "Tasks for this category will appear here."}
                   </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
