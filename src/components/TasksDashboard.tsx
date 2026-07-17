import React, { useState } from "react";
import { CheckCircle2, Clock, MapPin, Search, Filter, AlertCircle, FileText, User, Users, Activity, Layers, Calendar, ClipboardList } from "lucide-react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { PatientChartModal } from "./PatientChartModal";

export default function TasksDashboard({ language }: { language: "ar" | "en" }) {
  const { patients } = useHIS();
  const isAr = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create a robust task list grouped by department using all patients
  const departments = [
    { id: "icu", nameEn: "Intensive Care Unit (ICU)", nameAr: "وحدة العناية المركزة", color: "rose" },
    { id: "er", nameEn: "Emergency Room (ER)", nameAr: "قسم الطوارئ", color: "orange" },
    { id: "ward_a", nameEn: "Inpatient Ward A", nameAr: "جناح التنويم أ", color: "blue" },
    { id: "ward_b", nameEn: "Inpatient Ward B", nameAr: "جناح التنويم ب", color: "emerald" },
    { id: "opd", nameEn: "Outpatient Clinics", nameAr: "العيادات الخارجية", color: "indigo" }
  ];

  // Distribute patients into departments for demo purposes based on their IDs/status
  const getTasksByDepartment = () => {
    const tasks: Record<string, any[]> = {};
    departments.forEach(d => tasks[d.id] = []);
    
    patients.forEach((p, idx) => {
      // Assign a pseudo-random department
      const dept = departments[idx % departments.length];
      
      // Create some tasks for this patient
      const taskTypes = [
        { titleEn: "Administer Morning Meds", titleAr: "إعطاء أدوية الصباح", type: "medication", urgency: "high", time: "08:00 AM" },
        { titleEn: "Collect Blood Sample", titleAr: "سحب عينة دم", type: "lab", urgency: "medium", time: "09:30 AM" },
        { titleEn: "Doctor Consultation", titleAr: "استشارة الطبيب", type: "consultation", urgency: "high", time: "10:00 AM" },
        { titleEn: "Discharge Preparation", titleAr: "تجهيز خروج المريض", type: "admin", urgency: "low", time: "01:00 PM" },
        { titleEn: "Vital Signs Check", titleAr: "فحص العلامات الحيوية", type: "vitals", urgency: "medium", time: "Every 4h" }
      ];
      
      const taskCount = (idx % 3) + 1; // 1 to 3 tasks per patient
      for(let i=0; i<taskCount; i++) {
        const tType = taskTypes[(idx + i) % taskTypes.length];
        tasks[dept.id].push({
          id: `task-${p.id}-${i}`,
          patientId: p.id,
          patientName: isAr ? p.nameAr : p.name,
          ...tType,
          status: i === 0 ? "pending" : "completed" // Just to show some variety
        });
      }
    });
    
    return tasks;
  };

  const tasksByDept = getTasksByDepartment();
  const [activeDept, setActiveDept] = useState(departments[0].id);
  const [selectedPatientChart, setSelectedPatientChart] = useState<{id: string, name: string} | null>(null);

  const openPatientChart = (patientId: string, patientName: string) => {
    setSelectedPatientChart({ id: patientId, name: patientName });
  };

  const filteredTasks = tasksByDept[activeDept]?.filter(task => 
    task.patientName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || 
    task.patientId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    task.titleEn?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    task.titleAr?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-slate-50 overflow-hidden font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isAr ? "خطة المهام وواجبات المرضى" : "Patient Task Tracking & Kardex"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "جميع المرضى مرتبين حسب الأقسام" : "All patients sorted by departments"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${isAr ? "right-3" : "left-3"}`} />
            <input 
              type="text" 
              placeholder={isAr ? "بحث برقم المريض، الاسم، المهمة..." : "Search MRN, Name, Task..."}
              className={`${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar Departments */}
        <div className="w-full md:w-64 bg-white border-b md:border-b-0 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto max-h-48 md:max-h-none" style={{ borderRightWidth: isAr ? 0 : '1px', borderLeftWidth: isAr ? '1px' : 0 }}>
          <div className="p-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{isAr ? "الأقسام والمواقع" : "Departments & Locations"}</h3>
            <div className="space-y-1">
              {departments.map(dept => {
                const isActive = activeDept === dept.id;
                const taskCount = tasksByDept[dept.id]?.length || 0;
                return (
                  <button 
                    key={dept.id}
                    onClick={() => setActiveDept(dept.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all ${isActive ? `bg-${dept.color}-50 border border-${dept.color}-200 shadow-sm` : "hover:bg-slate-50 border border-transparent"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className={`w-5 h-5 ${isActive ? `text-${dept.color}-600` : "text-slate-400"}`} />
                      <span className={`font-bold ${isActive ? `text-${dept.color}-900` : "text-slate-600"}`}>
                        {isAr ? dept.nameAr : dept.nameEn}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${isActive ? `bg-${dept.color}-200 text-${dept.color}-800` : "bg-slate-100 text-slate-500"}`}>
                      {taskCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-4">
            {filteredTasks?.length === 0 ? (
              <div className="text-center py-20">
                <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-500">{isAr ? "لا توجد مهام" : "No tasks found"}</h3>
              </div>
            ) : (
              filteredTasks?.map(task => (
                <div key={task.id} className={`bg-white border ${task.status === 'completed' ? 'border-slate-200 opacity-60' : task.urgency === 'high' ? 'border-rose-200' : 'border-slate-200'} p-4 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer`} onClick={() => openPatientChart(task.patientId, task.patientName)}>
                  <div className="flex items-center gap-4 flex-1">
                    <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-500'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <h4 className={`font-bold text-sm ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {isAr ? task.titleAr : task.titleEn}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">{task.time}</span>
                          {task.urgency === 'high' && <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">{isAr ? "عاجل" : "Urgent"}</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800 hover:text-indigo-600 transition" onClick={(e) => { e.stopPropagation(); openPatientChart(task.patientId, task.patientName); }}>
                            {task.patientName}
                          </div>
                          <div className="text-xs font-mono text-slate-500">{task.patientId}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pr-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openPatientChart(task.patientId, task.patientName); }}
                          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition opacity-0 group-hover:opacity-100"
                        >
                          {isAr ? "فتح الملف الطبي" : "Open Medical File"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Patient Chart Modal */}
      {selectedPatientChart && (
        <PatientChartModal
          patientId={selectedPatientChart.id}
          patientName={selectedPatientChart.name}
          isAr={isAr}
          onClose={() => setSelectedPatientChart(null)}
        />
      )}
    </div>
  );
}


